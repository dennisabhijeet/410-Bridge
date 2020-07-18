var notificationHelper = require('./notification.helper')
exports.params = async (req, res, next) => {
  const notification = await notificationHelper.findNotification({
    _id: req.params.id,
  })
  if (!notification) {
    next(new Error('No notification with that id'))
  } else {
    req.notification = notification
    next()
  }
}

exports.get = async (req, res, next) => {
  const query = {}
  if (req.user.cat !== 'admin') query.user = req.user._id
  const notifications = await notificationHelper.findNotifications(query)
  res.json(notifications)
}

exports.getOne = async (req, res, next) => {
  if (
    !(req.notification.user === req.user.profile._id) &&
    !(req.user.cat === 'admin')
  ) {
    next(new Error('Unauthorized'))
    return
  }
  // const notification = await notificationHelper.findNotification({
  //   _id: req.params.id
  // })
  res.json(req.notification)
}

// exports.put = async (req, res, next) => {
//   if (req.user.cat !== 'admin') {
//     next(new Error('Unauthorized'))
//     return
//   }
//   const updated = await notificationHelper.updateNotification(
//     req.notification,
//     req.body
//   )
//   res.json(updated)
// }

exports.post = async (req, res, next) => {
  if (req.user.cat !== 'admin') {
    next(new Error('Unauthorized'))
    return
  }
  const newNotification = await notificationHelper.createNotification(req.body)
  res.status(201).json(newNotification)
}

exports.postToken = async (req, res, next) => {
  req.body.userId = req.user._id
  const newToken = await notificationHelper.createNotificationToken(req.body)
  console.log(newToken)
  res.status(201)
}

exports.delete = async (req, res, next) => {
  if (req.user.cat !== 'admin') {
    next(new Error('Unauthorized'))
    return
  }
  const removed = await notificationHelper.deleteNotification(req.notification)
  res.json(removed)
}
