const { TripUser, TripUserRole } = require('./tripUser.model')
const { Trip } = require('../trip/trip.model')
const { TripRole } = require('../tripRole/tripRole.model')
const { User } = require('../user/user.model')
const { createMultipleUsers, createUser } = require('../user/user.helper')

const _ = require('lodash')

/**
 * userId
 * tripId
 * additional
 */

// exports.createTripUser = async (tripUserData, partnerId) => {
//   const user = createUser(tri)
//   let tripUser = await TripUser.create(tripUserData)
//   return tripUser
// }

exports.createTripUsers = async (tripUserData = [], tripId, partnerId) => {
  // filter data if repeted and count the additional
  const tripUserDictionary = {}
  for (let i = 0; i < tripUserData.length; i++) {
    if (tripUserDictionary[tripUserData[i].email]) {
      tripUserDictionary[tripUserData[i].email].additional += 1
    } else {
      tripUserData[i].additional =
        +tripUserData[i].additional >= 0 ? +tripUserData[i].additional : 0
      tripUserDictionary[tripUserData[i].email] = tripUserData[i]
    }
  }
  const filteredTripUsersData = Object.values(tripUserDictionary)
  const users = await createMultipleUsers(filteredTripUsersData, partnerId) // n
  const trip = await Trip.findByPk(tripId) // 1
  const tripUsersPromise = filteredTripUsersData.map(
    async (singleTripUserData, idx) => {
      let tripUser = await TripUser.findOne({
        where: {
          tripId: trip._id,
          userId: users[idx]._id,
        },
      })
      if (!tripUser || !Object.keys(tripUser).length) {
        await trip.addUser(users[idx], {
          through: {
            additional: singleTripUserData.additional,
          },
        })
        tripUser = await TripUser.findOne({
          where: {
            tripId: trip._id,
            userId: users[idx]._id,
          },
        })
      } else {
        await tripUser.update({
          additional: +tripUser.additional + +singleTripUserData.additional,
        })
      }
      return tripUser
    }
  )
  const tripUsers = await Promise.all(tripUsersPromise) // n
  // ======================================================
  // const tripUsersRolesPromise = tripUserData.map((singleTripUserData, idx) => {
  //   if (singleTripUserData.tripRoles)
  //     return tripUsers[idx].addTripRoles(singleTripUserData.tripRoles) // n
  //   return new Promise((res) => res(''))
  // })

  // await Promise.all(tripUsersRolesPromise)

  return tripUsers
}

exports.updateTripUser = async (tripUserData, tripUserNewData) => {
  const tripUser = await TripUser.findByPk(tripUserData._id)
  if (tripUserNewData.additional) {
    await tripUser.update({
      additional: tripUserNewData.additional,
    })
  }
  if (tripUserNewData.trip_roles) {
    await tripUser.setTrip_roles(tripUserNewData.trip_roles)
  }
  return tripUserNewData
}

exports.deleteTripUser = async (where = {}) => {
  await TripUser.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findTripUsers = async (where = {}, partnerId) => {
  const tripUsers = await TripUser.findAll({
    where,
    include: [
      {
        model: Trip,
        attributes: ['_id', 'name', 'partnerId'],
        where: { partnerId },
      },
      { model: User, attributes: ['_id', 'name', 'email'] },
      { model: TripRole, attributes: ['_id', 'name'] },
    ],
  })
  return tripUsers
}

exports.findTripUser = async (where = {}) => {
  const tripUser = await TripUser.findOne({
    where,
    include: [
      { model: Trip, attributes: ['_id', 'name', 'partnerId'] },
      { model: User, attributes: ['_id', 'name', 'email'] },
      { model: TripRole, attributes: ['_id', 'name'] },
    ],
  })
  return tripUser ? tripUser : {}
}
