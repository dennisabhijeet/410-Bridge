var messageHelper = require('./message.helper')

exports.params = async (req, res, next) => {
  const message = await messageHelper.findMessage({
    _id: req.params.id,
  })
  if (Object.keys(message).length == 0) {
    next(new Error('No message found'))
  } else {
    req.requestedMessage = message
    next()
  }
}

exports.get = async (req, res, next) => {
  const partnerId = req.partner._id

  const messages = await messageHelper.findMessages({
    partnerId,
    ...req.query,
  })
  res.json(messages)
}

exports.getOne = async (req, res, next) => {
  const partnerId = req.partner._id
  if (!(req.requestedMessage.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedMessage)
}

exports.put = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      Object.keys(req.policy).length > 0 &&
      req.requestedMessage.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const updated = await messageHelper.updateMessage(
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
  const newMessage = await messageHelper.createMessage(req.body)
  res.status(201).json(newMessage)
}

exports.delete = async (req, res, next) => {
  const partnerId = req.partner._id
  if (
    !(
      req.policy &&
      req.policy.deleteData &&
      req.requestedMessage &&
      req.requestedMessage.partnerId == partnerId
    )
  ) {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await messageHelper.deleteMessage({ _id: req.params.id })
  res.json(removed)
}
