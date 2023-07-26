var announcementHelper = require('./announcement.helper')
var tripHelper = require('../trip/trip.helper')
var countryHelper = require('../country/country.helper')
var communityHelper = require('../community/community.helper')
var organizationHelper = require('../organization/organization.helper')
const { orderString, searchObj } = require('../../util/helpers')

exports.params = async (req, res, next) => {
  const announcement = await announcementHelper.findAnnouncement({
    _id: req.params.id,
  })
  if (Object.keys(announcement).length == 0) {
    next(new Error('No announcement found'))
  } else {
    req.requestedAnnouncement = announcement
    next()
  }
}

exports.get = async (req, res, next) => {
  let page = 0
  let limit = 100
  let descending = 1
  let order = orderString('_id', descending)
  let search = {}
  if (req.query.page) {
    page = Number(req.query.page) - 1
    delete req.query.page
  }
  if (req.query.limit) {
    limit = Number(req.query.limit)
    delete req.query.limit
  }
  /**
   * descending [1 => true, 0 => false]
   */
  if (req.query.sortBy) {
    descending = +(req.query.descending || descending)
    order = orderString(req.query.sortBy, descending)
    delete req.query.sortBy
    delete req.query.descending
  }
  if (req.query.title) {
    search = { ...search, ...searchObj('title', req.query.title) }
    delete req.query.title
  }
  const partnerId = req.partner._id
  const announcements = await announcementHelper.findAnnouncements({
    where: {
      partnerId,
      ...req.query,
      ...search,
    },
    order,
    offset: page * limit,
    limit,
  })
  res.json(announcements)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedAnnouncement.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedAnnouncement)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedAnnouncement.partnerId == partnerId &&
      req.policy.sendNotification
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  // can't change partner
  delete req.body.partnerId
  const updated = await announcementHelper.updateAnnouncement(
    { _id: req.params.id },
    req.body
  )
  res.json(updated)
}

exports.post = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(Object.keys(req.policy).length > 0 && req.policy.sendNotification)) {
    next(new Error('Unauthorized'))
    return
  }

  if (req.query.type) {
    const type = req.query.type // country || community || organization
    const typeId = req.query.typeId // _id

    let trips = []

    switch (type) {
      case 'country':
        trips = (
          await tripHelper.findTrips({
            where: {
              countryId: typeId,
              partnerId,
            },
          })
        ).trips
        break
      case 'community':
        const community = await communityHelper.findCommunity({
          _id: typeId,
          partnerId,
        })
        trips = await community.getTrips()
        break
      case 'organization':
        const organization = await organizationHelper.findOrganization({
          _id: typeId,
          partnerId,
        })
        trips = await organization.getTrips()
        break
    }
    const announcements = trips.map((trip) => {
      return {
        ...req.body,
        partnerId,
        tripId: trip._id,
      }
    })
    const newAnnouncementPromises = announcements.map((announcement) => {
      return announcementHelper.createAnnouncement(announcement)
    })
    res.status(201).json(await Promise.all(newAnnouncementPromises))
    return
  }

  req.body.partnerId = partnerId
  console.log("req.body",req.body);
  const newAnnouncement = await announcementHelper.createAnnouncement(req.body)
  res.status(201).json([newAnnouncement])
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedAnnouncement.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await announcementHelper.deleteAnnouncement({
    _id: req.params.id,
  })
  res.json(removed)
}
