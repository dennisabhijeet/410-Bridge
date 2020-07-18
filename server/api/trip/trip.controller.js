const tripHelper = require('./trip.helper')
const { orderString, searchObj } = require('../../util/helpers')

exports.params = async (req, res, next) => {
  const trip = await tripHelper.findTrip({
    _id: req.params.id,
  })
  if (Object.keys(trip).length == 0) {
    next(new Error('No trip found'))
  } else {
    req.requestedTrip = trip
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
  if (req.query.name) {
    search = { ...search, ...searchObj('name', req.query.name) }
    delete req.query.name
  }
  const partnerId = req.partner._id
  const userId = req.user._id
  const requestedUserId = req.query.userId || 0
  delete req.query.userId

  if (!(requestedUserId == userId || Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }

  if (requestedUserId) {
    const trips = await tripHelper.findTrips(
      {
        where: {
          partnerId,
          ...search,
        },
      },
      userId
    )
    res.json(trips)
    return
  }
  // for admin users
  const trips = await tripHelper.findTrips({
    where: {
      partnerId,
      ...req.query,
      ...search,
    },
    order,
    offset: page * limit,
    limit,
  })
  res.json(trips)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  const userId = req.user._id
  const requestedUserId = req.query.userId || 0
  delete req.query.userId

  if (
    !(requestedUserId == userId || req.requestedTrip.partnerId == partnerId)
  ) {
    next(new Error('Unauthorized'))
    return
  }
  if (requestedUserId) {
    const trip = await tripHelper.findTripForUser(
      {
        _id: req.requestedTrip._id,
      },
      userId
    )
    res.json(trip)
    return
  }
  res.json(req.requestedTrip)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedTrip.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  if (!(req.policy && req.policy.makeTripActive)) {
    delete req.body.is_active
  }
  const updated = await tripHelper.updateTrip({ _id: req.params.id }, req.body)
  res.json(updated)
}

exports.post = async (req, res, next) => {
  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }
  const partnerId = req.partner._id
  if (!(req.policy && req.policy.makeTripActive)) {
    delete req.body.is_active
  }
  const newTrip = await tripHelper.createTrip(
    {
      ...req.body,
      partnerId,
    },
    req.user
  )
  res.status(201).json(newTrip)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id

  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedTrip &&
      req.requestedTrip.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await tripHelper.deleteTrip({ _id: req.params.id })
  res.json(removed)
}
