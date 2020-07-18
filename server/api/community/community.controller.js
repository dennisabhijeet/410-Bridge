const { orderString, searchObj } = require('../../util/helpers')
var communityHelper = require('./community.helper')

exports.params = async (req, res, next) => {
  const community = await communityHelper.findCommunity({
    _id: req.params.id,
  })
  if (Object.keys(community).length == 0) {
    next(new Error('No community found'))
  } else {
    req.requestedCommunity = community
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

  // if (!(req.policy && req.policy.createCommunity)) {
  //   next(new Error('Unauthorized'))
  //   return
  // }
  const communities = await communityHelper.findCommunities({
    where: {
      partnerId,
      ...search,
      ...req.query,
    },
    order,
    offset: page * limit,
    limit,
  })
  res.json(communities)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedCommunity.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedCommunity)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedCommunity.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const updated = await communityHelper.updateCommunity(
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
  const newCommunity = await communityHelper.createCommunity(req.body)
  res.status(201).json(newCommunity)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedCommunity &&
      req.requestedCommunity.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await communityHelper.deleteCommunity({ _id: req.params.id })
  res.json(removed)
}
