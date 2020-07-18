var { TripDoc } = require('./tripDoc.model')
var { Partner } = require('../partners/partner.model')
var _ = require('lodash')

/**
 * tripId
 * text
 * url
 */

exports.createTripDoc = async (tripDocData) => {
  let tripDoc = await TripDoc.create(tripDocData)
  return tripDoc
}

exports.updateTripDoc = async (where = {}, tripDocNewData) => {
  await TripDoc.update(tripDocNewData, { where })
  return tripDocNewData
}

exports.deleteTripDoc = async (where = {}) => {
  await TripDoc.destroy({ where })

  return { _id: where._id, removed: true }
}

exports.findTripDocs = async (where = {}) => {
  const tripDocs = await TripDoc.findAll({
    where,
    include: [{ model: Partner, attributes: ['name', '_id'] }],
    order: [['_id', 'DESC']],
  })
  return tripDocs
}

exports.findTripDoc = async (where = {}) => {
  const tripDoc = await TripDoc.findOne({
    where,
    include: [{ model: Partner, attributes: ['name', '_id'] }],
  })
  return tripDoc ? tripDoc : {}
}
