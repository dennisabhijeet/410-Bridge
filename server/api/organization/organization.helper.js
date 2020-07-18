var Sequelize = require('sequelize')
var sequelize = require('../../util/db')
var { Organization } = require('./organization.model')
var { Partner } = require('../partners/partner.model')
var { Trip } = require('../trip/trip.model')
var { Organization } = require('../organization/organization.model')
var _ = require('lodash')

/**
 * name
 */

exports.createOrganization = async (organizationData) => {
  const organization = await Organization.create(organizationData)
  return organization
}

exports.updateOrganization = async (where = {}, organizationNewData) => {
  await Organization.update(organizationNewData, { where })
  return organizationNewData
}

exports.deleteOrganization = async (where = {}) => {
  await Organization.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findOrganizations = async ({ where, offset, limit, order }) => {
  const organizations = await Organization.findAll({
    where,
    attributes: {
      include: [
        [Sequelize.fn('COUNT', sequelize.col('trips._id')), 'trips_count'],
      ],
    },
    include: [
      {
        model: Trip,
        duplicating: false,
        attributes: [],
        required: false,
      },
    ],
    group: ['organizations._id'],
    offset,
    limit,
    order,
  })
  return organizations
}

exports.findOrganization = async (where = {}) => {
  const organization = await Organization.findOne({
    where,
    include: [
      { model: Partner, attributes: ['_id', 'name'] },
      {
        model: Trip,
        attributes: ['_id', 'name'],
      },
    ],
  })
  return organization ? organization : {}
}
