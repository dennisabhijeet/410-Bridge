const moment = require('moment')
const {
  findCountry,
  createCountry,
} = require('../../api/country/country.helper')
const {
  findCommunity,
  createCommunity,
} = require('../../api/community/community.helper')
const {
  findOrganization,
  createOrganization,
} = require('../../api/organization/organization.helper')
const {
  findTripRole,
  createTripRole,
} = require('../../api/tripRole/tripRole.helper')
const {
  createTripUsers,
  updateTripUser,
} = require('../../api/tripUsers/tripUser.helper')
const { findPolicy } = require('../../api/policy/policy.helper')
const { findTrip, createTrip } = require('../../api/trip/trip.helper')
const {
  getTripPagination,
  saveTripPagination,
} = require('./manageMission.helper')
const {
  getActiveTrips,
  getTripUsers,
  getUser,
  getTrip,
} = require('../../services/managemission')

const getTrips = async () => {
  // find active trips
  const activeTrips = await getActiveTrips()

  if (!activeTrips.length) return

  // get the partner of the root policy
  const { partnerId } = await findPolicy({ name: 'root' })

  // Loop one by one
  for (let i = 0; i < activeTrips.length; i++) {
    const trip = activeTrips[i]

    // check if the trip is already created in our system
    let ourTrip = await findTrip({ managed_mission_id: trip.TripId })

    // if not in our system make a trip
    if (!Object.keys(ourTrip).length) {
      // get Trip Data
      const tripData = await getTrip(trip.TripId)

      // createTrip
      ourTrip = await createTripFromManageMission(tripData, partnerId)
    }

    // find existing participants pagination
    const tripUserPagination = await getTripPagination(
      ourTrip.managed_mission_id
    )
    let pageSize, pageCount, pageNumber
    pageNumber = tripUserPagination.pageNumber || 1
    pageSize = tripUserPagination.pageSize || 10
    pageCount = tripUserPagination.pageCount || 0

    // get and save trip participants
    const {
      updatedPageNumber,
      updatedPageSize,
      updatedPageCount,
    } = await getAndSavePartcipants(ourTrip, pageNumber, pageSize, pageCount)
    if (
      pageSize != updatedPageSize ||
      pageCount != updatedPageCount ||
      pageNumber != updatedPageNumber
    ) {
      // update pagination
      await saveTripPagination(
        ourTrip.managed_mission_id,
        updatedPageNumber,
        updatedPageSize,
        updatedPageCount
      )
    }
  }
}

const createTripFromManageMission = async (tripData, partnerId) => {
  /**
   * "Id": 545,
   * "TripName": "ApiTestTrip6",
   * "DepartureDate": "/Date(1401606000000)/",
   * "ReturnDate": "/Date(1402815600000)/",
   * "PartneringOrganization": "None",
   * "TripDescription": null,
   * "Qualifications": "Medical skills required",
   * "TripDestination": null,
   * "Country": "Tanzania",
   */

  const {
    Id,
    TripName,
    DepartureDate,
    ReturnDate,
    PartneringOrganization,
    TripDescription,
    Qualifications,
    TripDestination,
    Country,
  } = tripData

  // find country in our system
  let country = await findCountry({
    partnerId,
    name: Country,
  })
  if (!Object.keys(country).length) {
    // if the country is not found create the country
    country = await createCountry({ partnerId, name: Country })
  }
  // find community in our system
  let community = await findCommunity({
    partnerId,
    name: TripDestination,
  })
  if (!Object.keys(community).length) {
    // if the community is not found create the community
    community = await createCommunity({
      partnerId,
      name: TripDestination || Country,
      countryId: country._id,
    })
  }
  // find organigations in our system
  let organizations = PartneringOrganization.split(';')
  organizations = await Promise.all(
    organizations.map(async (org) => {
      let organizationName = org.trim()
      let organization = await findOrganization({
        partnerId,
        name: organizationName,
      })
      if (!Object.keys(organization).length) {
        // if the organizations is not found create the organizations
        organization = await createOrganization({
          partnerId,
          name: organizationName,
        })
      }
      return organization
    })
  )
  // assamble the trip details
  const trip = {
    name: TripName,
    partnerId,
    countryId: country._id,
    start_date: moment(DepartureDate).format('MM/DD/YYYY'),
    end_date: moment(ReturnDate).format('MM/DD/YYYY'),
    is_active: true,
    communities: [community._id],
    organizations: organizations.map((org) => org._id),
    managed_mission_id: Id,
    description: `${TripDescription || ''}${Qualifications || ''}`,
  }
  // save the trip in our system
  return await createTrip(trip)
}

const getAndSavePartcipants = async (
  ourTrip,
  pageNumber = 1,
  pageSize = 10,
  pageCount = 0
) => {
  // get the trip participants
  const participants = await getTripUsers(
    ourTrip.managed_mission_id,
    pageNumber,
    pageSize
  )
  const count = participants.length
  if (pageCount < participants.length) {
    // save participants
    await saveParticipants(
      ourTrip._id,
      ourTrip.partnerId,
      participants.splice(pageCount, count)
    )
    pageCount = count
    if (pageSize == pageCount) {
      return await getAndSavePartcipants(ourTrip, pageNumber + 1, pageSize, 0)
    }
  }
  return {
    updatedPageNumber: pageNumber,
    updatedPageSize: pageSize,
    updatedPageCount: pageCount,
  }
}

const saveParticipants = async (tripId, partnerId, participants) => {
  // loop through them
  let tripUsers = await Promise.all(
    participants.map(async (participant) => {
      let { PersonId } = participant
      let { FullName, EmailAddress } = await getUser(PersonId)

      // assample trip partcipant
      const tripUser = {
        name: FullName,
        email: EmailAddress,
      }
      return tripUser
    })
  )

  //  and create them in bulk
  tripUsers = await createTripUsers(tripUsers, tripId, partnerId)

  // assign roles if needed
  return await Promise.all(
    tripUsers.map(async (tripUser, index) => {
      const { Role } = participants[index]
      // get trip role and find it in our system
      if (Role != 'Participant') {
        let tripRole = await findTripRole({ name: Role.trim() })
        // if no trip role crete trip role
        if (!Object.keys(tripRole).length) {
          tripRole = await createTripRole({
            partnerId,
            name: Role.trim(),
          })
        }
        return await updateTripUser(tripUser, {
          trip_roles: [tripRole],
        })
      }
      return new Promise((res, rej) => {
        res('')
      })
    })
  )
}

module.exports = {
  getTrips,
}
