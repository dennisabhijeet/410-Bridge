var { Community } = require('./community.model')
var { Country } = require('../country/country.model')
const { Partner } = require('../partners/partner.model')
const { Trip } = require('../trip/trip.model')

var Sequelize = require('sequelize')
var _ = require('lodash')

/**
 * name
 * countryId
 * link?
 */

exports.createCommunity = async (communityData) => {
  let community = await Community.create(communityData)
  return community
}

exports.updateCommunity = async (where = {}, communityNewData) => {
  await Community.update(communityNewData, { where })
  return communityNewData
}

exports.deleteCommunity = async (where = {}) => {
  await Community.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findCommunities = async ({ where = {}, offset, limit, order }) => {
  const communities = await Community.findAll({
    where,
    include: [
      {
        model: Country,
        attributes: ['_id', 'name'],
      },
    ],
    offset,
    limit,
    order,
  })
  return communities
}

exports.findCommunity = async (where = {}) => {
  const community = await Community.findOne({
    where,
    include: [
      {
        model: Country,
        attributes: ['_id', 'name'],
      },
      {
        model: Partner,
        attributes: ['_id', 'name'],
      },
      {
        model: Trip,
        attributes: ['_id', 'name'],
      },
    ],
  })
  return community ? community : {}
}
