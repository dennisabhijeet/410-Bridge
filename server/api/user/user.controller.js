const { orderString, searchObj } = require('../../util/helpers')
var userHelper = require('./user.helper')
var { findPolicy } = require('../policy/policy.helper')
var tripHelper = require('../trip/trip.helper')
exports.params = async (req, res, next) => {
  const user = await userHelper.findUser({
    _id: req.params.id,
  })
  if (Object.keys(user).length == 0) {
    next(new Error('No user found'))
  } else {
    req.requestedUser = user
    next()
  }
}

// Get all users
exports.get = async (req, res, next) => {
  if (
    Object.keys(req.policy).length == 0 ||
    !(req.partner && req.partner._id)
  ) {
    next(new Error('Unauthorized'))
    return
  }
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
  let users = []
  if (req.query.with_policy && req.query.with_policy == 1) {
    delete req.query.with_policy
    users = await userHelper.findUsersWithPolicy(
      {
        where: { ...req.query, ...search },
        offset: page * limit,
        limit,
        order,
      },
      partnerId
    )
  } else {
    users = await userHelper.findUsers(
      {
        where: { ...req.query, ...search },
        offset: page * limit,
        limit,
        order,
      },
      partnerId
    )
  }
  res.json(users)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.user._id === req.params.id ||
      (Object.keys(req.policy).length > 0 &&
        req.requestedUser.partners &&
        req.requestedUser.partners.find((partner) => partner._id == partnerId))
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const user = await userHelper.findUser({ _id: req.params.id }, partnerId)
  res.json(user)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.user._id === req.params.id ||
      (Object.keys(req.policy).length > 0 &&
        req.requestedUser.partners &&
        req.requestedUser.partners.find((partner) => partner._id == partnerId))
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  if (req.body.policyId && !(req.policy && req.policy.updatePartnerInfo)) {
    delete req.body.policyId
  }
  if (req.body.policyId && !req.policy.createPartner) {
    const policy = await findPolicy({ _id: req.body.policyId })
    if (policy.createPartner) delete req.body.policyId
  }
  const updated = await userHelper.updateUser(
    { _id: req.params.id },
    req.body,
    req.requestedUser,
    partnerId
  )
  res.json(updated)
}

exports.post = async (req, res, next) => {
  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }
  const partner = req.partner._id
  if (Array.isArray(req.body)) {
    const newUsers = await userHelper.createMultipleUsers(req.body, partner)
    res.status(201).json(newUsers.map((user) => user.toJson()))
    return
  }
  if (!(req.body.policyId && req.policy && req.policy.updatePartnerInfo)) {
    delete req.body.policyId
  }
  if (req.body.policyId && !req.policy.createPartner) {
    const policy = await findPolicy({ _id: req.body.policyId })
    if (policy.createPartner) delete req.body.policyId
  }
  const newUser = await userHelper.createUser({
    ...req.body,
    partnerId: partner,
  })
  res.status(201).json(newUser.toJson())
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.user._id === req.params.id ||
      (req.policy &&
        req.policy.deleteData &&
        req.requestedUser.partners &&
        req.requestedUser.partners.find((partner) => partner._id == partnerId))
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await userHelper.deleteUser({ _id: req.params.id }, partnerId)
  res.json(removed)
}

exports.me = function (req, res) {
  res.json(req.user)
}
