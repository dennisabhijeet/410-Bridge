var Sequelize = require('sequelize')
var sequelize = require('../../util/db')
var { TripRole } = require('./tripRole.model')
var { Partner } = require('../partners/partner.model')
var { User } = require('../user/user.model')
var { Country } = require('../country/country.model')
var { Community } = require('../community/community.model')
var { Organization } = require('../organization/organization.model')
var _ = require('lodash')

/**
 * name
 */

exports.createTripRole = async (tripRoleData) => {
  const tripRole = await TripRole.create(tripRoleData)
  return tripRole
}

exports.updateTripRole = async (where = {}, tripRoleNewData) => {
  await TripRole.update(tripRoleNewData, { where })
  return tripRoleNewData
}

exports.deleteTripRole = async (where = {}) => {
  await TripRole.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findTripRoles = async ({ where }) => {
  const tripRoles = await TripRole.findAll({
    where,
  })
  return tripRoles
}

exports.findTripRole = async (where = {}) => {
  const tripRole = await TripRole.findOne({
    where,
    include: [{ model: Partner, attributes: ['_id', 'name'] }],
  })
  return tripRole ? tripRole : {}
}
