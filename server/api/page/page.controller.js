var pageHelper = require('./page.helper')

exports.params = async (req, res, next) => {
  const page = await pageHelper.findPage({
    _id: req.params.id,
  })
  if (Object.keys(page).length == 0) {
    next(new Error('No page found'))
  } else {
    req.requestedPage = page
    next()
  }
}

exports.get = async (req, res, next) => {
  const partnerId = req.partner._id

  let tripRoles = ''
  if (req.query.trip_roles) {
    tripRoles = req.query.trip_roles
    delete req.query.trip_roles
  }

  const pages = await pageHelper.findPages(
    {
      partnerId: partnerId,
      ...req.query,
    },
    tripRoles
  )

  res.json(pages)
}
exports.getAll = async (req, res, next) => {
  const partnerId = req.partner._id

  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }
  const pages = await pageHelper.findAllPages({
    partnerId: partnerId,
    ...req.query,
  })

  res.json(pages)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedPage.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedPage)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedPage.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const updated = await pageHelper.updatePage({ _id: req.params.id }, req.body)
  res.json(updated)
}

exports.post = async (req, res, next) => {
  if (!(Object.keys(req.policy).length > 0)) {
    next(new Error('Unauthorized'))
    return
  }
  const partnerId = req.partner._id
  req.body.partnerId = partnerId
  const newPage = await pageHelper.createPage(req.body)
  res.status(201).json(newPage)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedPage &&
      req.requestedPage.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await pageHelper.deletePage({ _id: req.params.id })
  res.json(removed)
}
