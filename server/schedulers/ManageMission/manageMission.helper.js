var Sequelize = require('sequelize')
var sequelize = require('../../util/db')
var { ManageMission } = require('./manageMission.model')
var _ = require('lodash')

/**
 * type
 * managed_mission_id
 * pageNumber
 * pageSize
 * pageCount
 */

exports.getTripPagination = async (managed_mission_id) => {
  const trip = await ManageMission.findOne({
    where: {
      type: 'trip',
      managed_mission_id,
    },
  })
  return trip || {}
}
exports.saveTripPagination = async (
  managed_mission_id,
  pageNumber,
  pageSize,
  pageCount
) => {
  let trip = await ManageMission.findOne({
    where: {
      type: 'trip',
      managed_mission_id,
    },
  })
  if (!trip || !Object.keys(trip).length) {
    trip = await ManageMission.create({
      type: 'trip',
      managed_mission_id,
      pageNumber,
      pageSize,
      pageCount,
    })
  } else {
    trip.update({
      pageNumber,
      pageSize,
      pageCount,
    })
  }
  return trip
}
