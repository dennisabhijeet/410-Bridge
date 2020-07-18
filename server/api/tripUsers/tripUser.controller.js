var tripUserHelper = require('./tripUser.helper')

exports.params = async (req, res, next) => {
  const tripUser = await tripUserHelper.findTripUser({
    _id: req.params.id,
  })
  if (Object.keys(tripUser).length == 0) {
    next(new Error('No tripUser found'))
  } else {
    req.requestedTripUser = tripUser
    next()
  }
}

exports.get = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }
  const tripUsers = await tripUserHelper.findTripUsers(
    {
      // partnerId: partnerId,
      ...req.query,
    },
    partnerId
  )
  res.json(tripUsers)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedTripUser.trip.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedTripUser)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedTripUser.trip.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  // once created can't change userId or tripId
  delete req.body.userId
  delete req.body.tripId
  const updated = await tripUserHelper.updateTripUser(
    req.requestedTripUser,
    req.body
  )
  res.json(updated)
}

exports.post = async (req, res, next) => {
  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }
  const partnerId = req.partner._id
  // req.body.partnerId = partnerId
  const { tripId, users } = req.body
  const newTripUser = await tripUserHelper.createTripUsers(
    users,
    tripId,
    partnerId
  )
  res.status(201).json(newTripUser)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedTripUser &&
      req.requestedTripUser.trip.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await tripUserHelper.deleteTripUser({ _id: req.params.id })
  res.json(removed)
}
