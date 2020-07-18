var Sequelize = require('sequelize')
var sequelize = require('../../util/db')
var { Announcement } = require('./announcement.model')
// var { Partner } = require('../partners/partner.model')
var { TripRole } = require('../tripRole/tripRole.model')
var { Trip } = require('../trip/trip.model')
var _ = require('lodash')
/**
 * title
 * userId (either userId or tripId. both can't be null)
 * tripId
 * announcement_date
 * body?
 * data? (JSON)
 * ttl?
 * subtitle?
 * badge?
 * channelId
 */
exports.createAnnouncement = async (announcementData) => {
  let announcement = await Announcement.create(announcementData)
  return announcement
}

exports.updateAnnouncement = async (where = {}, announcementNewData) => {
  await Announcement.update(announcementNewData, { where })
  return announcementNewData
}

exports.deleteAnnouncement = async (where = {}) => {
  await Announcement.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findAnnouncements = async ({ where = {}, offset, limit, order }) => {
  let announcements = await Announcement.findAll({
    where,
    include: [
      {
        model: TripRole,
        attributes: ['name'],
      },
      {
        model: Trip,
        attributes: ['name'],
      },
    ],
    offset,
    limit,
    order,
  })
  let count = await Announcement.count({
    where,
    attributes: ['_id'],
  })

  return { announcements, count }
}

exports.findAnnouncement = async (where = {}) => {
  const announcement = await Announcement.findOne({
    where,
    include: [
      {
        model: TripRole,
        attributes: ['name'],
      },
      {
        model: Trip,
        attributes: ['name'],
      },
    ],
  })
  return announcement ? announcement : {}
}
