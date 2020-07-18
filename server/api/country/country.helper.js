var Sequelize = require('sequelize')
var sequelize = require('../../util/db')
var { Country } = require('./country.model')
var { Partner } = require('../partners/partner.model')
var { Trip } = require('../trip/trip.model')
var { Community } = require('../community/community.model')
var _ = require('lodash')
/**
 * name
 * image?
 * flag?
 * longLat?
 * timezone?
 * currency?
 * currencySym?
 */
exports.createCountry = async (countryData) => {
  let country = await Country.create(countryData)
  return country
}

exports.updateCountry = async (where = {}, countryNewData) => {
  await Country.update(countryNewData, { where })
  return countryNewData
}

exports.deleteCountry = async (where = {}) => {
  await Country.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findCountries = async ({ where = {}, offset, limit, order }) => {
  let countries = await Country.findAll({
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
    group: ['countries._id'],
    offset,
    limit,
    order,
  })
  const communityCountPromises = countries.map((country) => {
    return country.countCommunities()
  })
  const communityCount = await Promise.all(communityCountPromises)
  countries = countries.map((country, idx) => {
    return { ...country.toJSON(), communities_count: communityCount[idx] }
  })
  return countries
}

exports.findCountry = async (where = {}) => {
  const country = await Country.findOne({
    where,
    include: [{ model: Partner, attributes: ['name', '_id'] }],
  })
  return country ? country : {}
}
