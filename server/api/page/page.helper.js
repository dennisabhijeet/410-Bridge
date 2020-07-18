var { Op } = require('sequelize')
var Sequelize = require('sequelize')
var sequelize = require('../../util/db')
var { findOr } = require('../../util/helpers')
var { Page, PageTripRole } = require('./page.model')
var { Partner } = require('../partners/partner.model')
var { TripRole } = require('../tripRole/tripRole.model')
var _ = require('lodash')

exports.createPage = async (pageData) => {
  const page = await Page.create(pageData)
  if (pageData.trip_roles && Array.isArray(pageData.trip_roles)) {
    await page.addTrip_roles(pageData.trip_roles)
  }
  return page
}

exports.updatePage = async (where = {}, pageNewData) => {
  await Page.update(pageNewData, { where })
  if (pageNewData.trip_roles && Array.isArray(pageNewData.trip_roles)) {
    const page = await Page.findByPk(where._id)
    await page.setTrip_roles(pageNewData.trip_roles)
  }
  return pageNewData
}

exports.deletePage = async (where = {}) => {
  await Page.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findAllPages = async (where = {}, tripRoles) => {
  const pages = await Page.findAll({
    where: {
      ...where,
    },
    include: [
      { model: Partner, attributes: ['_id', 'name'] },
      {
        model: TripRole,
        attributes: ['_id', 'name', 'partnerId'],
      },
    ],
  })

  return pages
}
exports.findPages = async (where = {}, tripRoles) => {
  let pagesWithRoles = []
  if (tripRoles) {
    pagesWithRoles = await Page.findAll({
      where: {
        ...where,
      },
      include: [
        { model: Partner, attributes: ['_id', 'name'] },
        {
          model: TripRole,
          attributes: ['_id', 'name', 'partnerId'],
          // where: { ...findOr('_id', JSON.parse(tripRoles)) },
          where: { _id: JSON.parse(tripRoles) },
        },
      ],
    })
  }
  const pagesWithOutRoles = await Page.findAll({
    where: {
      [Op.and]: [
        where,
        Sequelize.where(sequelize.col('trip_roles._id'), '=', null),
      ],
    },
    include: [
      { model: Partner, attributes: ['_id', 'name'] },
      {
        model: TripRole,
        as: 'trip_roles',
        attributes: ['_id', 'name'],
        duplicating: false,
        required: false,
      },
    ],
  })
  return [...pagesWithOutRoles, ...pagesWithRoles]
}

exports.findPage = async (where = {}) => {
  const page = await Page.findOne({
    where,
    include: [
      { model: Partner, attributes: ['_id', 'name'] },
      { model: TripRole, attributes: ['_id', 'name'] },
    ],
  })
  return page ? page : {}
}
