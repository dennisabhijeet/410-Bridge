var messageHelper = require('./message.helper')
var communityHelper = require('../community/community.helper')
var organizationHelper = require('../organization/organization.helper')
var tripHelper = require('../trip/trip.helper')
const { Op } = require('sequelize')

exports.params = async (req, res, next) => {
  const message = await messageHelper.findMessage({
    _id: req.params.id,
  })
  if (Object.keys(message).length == 0) {
    next(new Error('No message found'))
  } else {
    req.requestedMessage = message
    next()
  }
}

exports.get = async (req, res, next) => {
  const partnerId = req.partner._id

  const messages = await messageHelper.findMessages({
    partnerId,
    ...req.query,
  })
  res.json(messages)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedMessage.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedMessage)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedMessage.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const updated = await messageHelper.updateMessage(
    { _id: req.params.id },
    req.body
  )
  res.json(updated)
}

exports.post = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }
  if (req.query.type) {
    const type = req.query.type // country || community || organization | trips
    const typeId = req.query.typeId // _id || array<tripIds>
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
      case 'trips':
        trips = (
          await tripHelper.findTrips({
            where: {
              _id: {
                [Op.in]: [...typeId],
              },
            },
          })
        ).trips
        break
    }
    const tripMessages = trips.map((trip) => {
      return {
        ...req.body,
        tripId: trip._id,
        partnerId,
      }
    })
    const newTripMessages = tripMessages.map((tripMessage)=> {
      return messageHelper.createMessage(tripMessage)
    })
    res.status(201).json(await Promise.all(newTripMessages))
    return
  }
  req.body.partnerId = partnerId
  const newMessage = await messageHelper.createMessage(req.body)
  res.status(201).json(newMessage)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedMessage &&
      req.requestedMessage.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await messageHelper.deleteMessage({ _id: req.params.id })
  res.json(removed)
}
