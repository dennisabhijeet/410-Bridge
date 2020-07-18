var countryHelper = require('./country.helper')
const { orderString, searchObj } = require('../../util/helpers')

exports.params = async (req, res, next) => {
  const country = await countryHelper.findCountry({
    _id: req.params.id,
  })
  if (Object.keys(country).length == 0) {
    next(new Error('No country found'))
  } else {
    req.requestedCountry = country
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
  const countries = await countryHelper.findCountries({
    where: {
      partnerId,
      ...search,
    },
    order,
    offset: page * limit,
    limit,
  })
  res.json(countries)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedCountry.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedCountry)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedCountry.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  // can't change partner
  delete req.body.partnerId
  const updated = await countryHelper.updateCountry(
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
  const newCountry = await countryHelper.createCountry(req.body)
  res.status(201).json(newCountry)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedCountry &&
      req.requestedCountry.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await countryHelper.deleteCountry({ _id: req.params.id })
  res.json(removed)
}
