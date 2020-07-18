var organizationHelper = require('./organization.helper')
const { orderString, searchObj } = require('../../util/helpers')

exports.params = async (req, res, next) => {
  const organization = await organizationHelper.findOrganization({
    _id: req.params.id,
  })
  if (Object.keys(organization).length == 0) {
    next(new Error('No organization found'))
  } else {
    req.requestedOrganization = organization
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
    // delete req.query.page
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
  }
  if (req.query.name) {
    search = { ...search, ...searchObj('name', req.query.name) }
  }
  const partnerId = req.partner._id
  const organizations = await organizationHelper.findOrganizations({
    where: {
      partnerId,
      ...search,
    },
    order,
    offset: page * limit,
    limit,
  })
  res.json(organizations)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedOrganization.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedOrganization)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedOrganization.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  // can't change partner
  delete req.body.partnerId
  const updated = await organizationHelper.updateOrganization(
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
  req.body.partnerId = partnerId
  const newOrganization = await organizationHelper.createOrganization(req.body)
  res.status(201).json(newOrganization)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedOrganization &&
      req.requestedOrganization.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await organizationHelper.deleteOrganization({
    _id: req.params.id,
  })
  res.json(removed)
}
