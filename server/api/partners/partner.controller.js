var partnerHelper = require('./partner.helper')

exports.params = async (req, res, next) => {
  const partner = await partnerHelper.findPartner({
    _id: req.params.id,
  })
  if (Object.keys(partner).length == 0) {
    next(new Error('No partner found'))
  } else {
    req.requestedPartner = partner
    next()
  }
}

exports.get = async (req, res, next) => {
  // if (!(req.policy && req.policy.createPartner)) {
  //   next(new Error('Unauthorized'))
  //   return
  // }
  const partners = await partnerHelper.findPartners({ userId: req.user._id })
  res.json(partners)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(req.params.id == partnerId || (req.policy && req.policy.createPartner))
  ) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedPartner)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(req.policy && req.policy.updatePartnerInfo && req.params.id == partnerId)
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const updated = await partnerHelper.updatePartner(
    { _id: req.params.id },
    req.body
  )
  res.json(updated)
}

exports.post = async (req, res, next) => {
  if (!(req.policy && req.policy.createPartner)) {
    next(new Error('Unauthorized'))
    return
  }
  const newPartner = await partnerHelper.createPartner(
    {
      ...req.body,
    },
    req.userObj
  )
  res.status(201).json(newPartner)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.createPartner &&
      req.policy.deleteData &&
      req.requestedPartner &&
      req.requestedPartner.id == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await partnerHelper.deletePartner({ _id: req.params.id })
  res.json(removed)
}
