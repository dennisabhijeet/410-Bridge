var Sequelize = require('sequelize')
var sequelize = require('../../util/db')
var { Trip, TripCommunity } = require('./trip.model')
var { TripRole } = require('../tripRole/tripRole.model')
var { Partner } = require('../partners/partner.model')
var { User } = require('../user/user.model')
var { Country } = require('../country/country.model')
var { Community } = require('../community/community.model')
var { Organization } = require('../organization/organization.model')
var _ = require('lodash')
const { TripUser } = require('../tripUsers/tripUser.model')

/**
 * name
 * countryId
 * start_date
 * end_date
 * is_active
 * communities
 * organizations
 * icon?
 * managed_mission_id?
 * description?
 */

exports.createTrip = async (tripData) => {
  const trip = await Trip.create(tripData)
  const releationShipPromises = []
  if (tripData.communities && Array.isArray(tripData.communities)) {
    tripData.communities.forEach((communityId) => {
      releationShipPromises.push(trip.addCommunity(communityId))
    })
  }
  if (tripData.organizations && Array.isArray(tripData.organizations)) {
    tripData.organizations.forEach((organizationId) => {
      releationShipPromises.push(trip.addOrganization(organizationId))
    })
  }
  await Promise.all(releationShipPromises)
  return trip
}

exports.updateTrip = async (where = {}, tripNewData) => {
  let trip = await Trip.findByPk(where._id)
  await Trip.update(tripNewData, { where })
  const releationShipPromises = []
  if (tripNewData.communities && Array.isArray(tripNewData.communities)) {
    releationShipPromises.push(trip.setCommunities(tripNewData.communities))
  }
  if (tripNewData.organizations && Array.isArray(tripNewData.organizations)) {
    releationShipPromises.push(trip.setOrganizations(tripNewData.organizations))
  }
  await Promise.all(releationShipPromises)
  return tripNewData
}

exports.deleteTrip = async (where = {}) => {
  await Trip.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findTrips = async ({ where, offset, limit, order }, userId) => {
  if (userId) {
    const user = await User.findByPk(userId)
    return await user.getTrips({
      where: { ...where },
      include: [{ model: Country }],
    })
  }
  const query = {
    where,
    attributes: {
      include: [
        [Sequelize.fn('COUNT', sequelize.col('users._id')), 'users_count'],
      ],
    },
    subQuery: false,
    include: [
      {
        model: User,
        as: 'users',
        duplicating: false,
        attributes: [],
        required: false,
      },
      {
        model: Country,
        attributes: ['_id', 'name'],
        required: false,
        as: 'country',
      },
      {
        model: Organization,
        attributes: ['_id'],
        required: false,
        as: 'organizations',
      },
      {
        model: Community,
        attributes: ['_id'],
        required: false,
        as: 'communities',
      },
    ],
    group: ['trips._id'],
    offset,
    order,
    limit,
  }
  const trips = await Trip.findAll(query)
  const count = await Trip.count({
    where,
    attributes: ['_id'],
    col: 'trips._id',
  })

  return { trips, count }
}

exports.findTrip = async (where = {}) => {
  const trip = await Trip.findOne({
    where,
    include: [
      { model: Country, attributes: ['_id', 'name'] },
      { model: Community },
      { model: Organization },
      { model: Partner, attributes: ['_id', 'name'] },
    ],
  })
  return trip ? trip : {}
}
exports.findTripForUser = async (where = {}, userId) => {
  const trip = await Trip.findOne({
    where,
    include: [
      { model: Country, attributes: ['_id', 'name'] },
      { model: Community },
      { model: Organization },
    ],
  })
  if (!trip) return {}
  const tripUser = await TripUser.findOne({
    where: {
      userId,
      tripId: trip._id,
    },
    include: [{ model: TripRole, attributes: ['_id', 'name'] }],
  })
  if (!tripUser) return {}

  const data = {
    ...trip.toJSON(),
    trip_user: tripUser,
  }

  return data
}
