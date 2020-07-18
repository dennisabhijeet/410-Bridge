var tripDocHelper = require('./tripDoc.helper')

exports.params = async (req, res, next) => {
  const tripDoc = await tripDocHelper.findTripDoc({
    _id: req.params.id,
  })
  if (Object.keys(tripDoc).length == 0) {
    next(new Error('No document found'))
  } else {
    req.requestedTripDoc = tripDoc
    next()
  }
}

exports.get = async (req, res, next) => {
  const partnerId = req.partner._id

  const tripDocs = await tripDocHelper.findTripDocs({
    partnerId,
    ...req.query,
  })
  res.json(tripDocs)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedTripDoc.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedTripDoc)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedTripDoc.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const updated = await tripDocHelper.updateTripDoc(
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
  req.body.partnerId = partnerId
  const newTripDoc = await tripDocHelper.createTripDoc(req.body)
  res.status(201).json(newTripDoc)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedTripDoc &&
      req.requestedTripDoc.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await tripDocHelper.deleteTripDoc({ _id: req.params.id })
  res.json(removed)
}
