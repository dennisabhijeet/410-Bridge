var policyHelper = require('./policy.helper')

exports.params = async (req, res, next) => {
  const policy = await policyHelper.findPolicy({
    _id: req.params.id,
  })
  if (Object.keys(policy).length == 0) {
    next(new Error('No policy found'))
  } else {
    req.requestedPolicy = policy
    next()
  }
}

exports.get = async (req, res, next) => {
  if (
    Object.keys(req.policy).length == 0 ||
    !(req.partner && req.partner._id)
  ) {
    next(new Error('Unauthorized'))
    return
  }
  let partnerId = req.partner._id
  if (req.policy && req.policy.updatePartnerInfo && req.query.partnerId) {
    partnerId = req.query.partnerId
  }
  const policies = await policyHelper.findPolicies({ partnerId })
  res.json(policies)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedPolicy.partnerId &&
      req.requestedPolicy.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedPolicy)
}

exports.put = async (req, res, next) => {
  let partnerId = req.partner._id
  if (req.policy && req.policy.createPartner && req.body.partnerId) {
    partnerId = req.body.partnerId
  }
  if (
    !(
      req.policy &&
      req.policy.updatePartnerInfo &&
      req.requestedPolicy.partnerId &&
      req.requestedPolicy.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  if (!req.policy.createPartner) {
    delete req.body.createPartner
  }
  const updated = await policyHelper.updatePolicy(
    { _id: req.params.id },
    req.body
  )
  res.json(updated)
}

exports.post = async (req, res, next) => {
  if (!(req.policy && req.policy.updatePartnerInfo)) {
    next(new Error('Unauthorized'))
    return
  }
  let partnerId = req.partner._id
  if (req.policy && req.policy.createPartner && req.body.partnerId) {
    partnerId = req.body.partnerId
  }
  if (!req.policy.createPartner) {
    delete req.body.createPartner
  }
  const newPolicy = await policyHelper.createPolicy({
    ...req.body,
    partnerId,
  })
  res.status(201).json(newPolicy)
}

exports.delete = async (req, res, next) => {
  let partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.policy.updatePartnerInfo &&
      req.requestedPolicy.partnerId &&
      req.requestedPolicy.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await policyHelper.deletePolicy({ _id: req.params.id })
  res.json(removed)
}
