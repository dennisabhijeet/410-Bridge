const tripRoleHelper = require('./tripRole.helper')

exports.params = async (req, res, next) => {
  const tripRole = await tripRoleHelper.findTripRole({
    _id: req.params.id,
  })
  if (Object.keys(tripRole).length == 0) {
    next(new Error('No trip role found'))
  } else {
    req.requestedTripRole = tripRole
    next()
  }
}

exports.get = async (req, res, next) => {
  const partnerId = req.partner._id

  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }

  const tripRoles = await tripRoleHelper.findTripRoles({
    where: {
      partnerId,
    },
  })
  res.json(tripRoles)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedTripRole.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedTripRole)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedTripRole.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const updated = await tripRoleHelper.updateTripRole(
    { _id: req.params.id },
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
  const newTripRole = await tripRoleHelper.createTripRole(
    {
      ...req.body,
      partnerId,
    },
    req.user
  )
  res.status(201).json(newTripRole)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id

  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedTripRole &&
      req.requestedTripRole.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await tripRoleHelper.deleteTripRole({ _id: req.params.id })
  res.json(removed)
}
