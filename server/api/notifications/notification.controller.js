var notificationHelper = require('./notification.helper')
exports.params = async (req, res, next) => {
  const notification = await notificationHelper.findNotification({
    _id: req.params.id,
  })
  if (Object.keys(notification).length == 0) {
    next(new Error('No notification found'))
  } else {
    req.requestedNotification = notification
    next()
  }
}

exports.get = async (req, res, next) => {
  const requestedUserId = req.query.userId
  if (!requestedUserId || req.user._id != requestedUserId) {
    next(new Error('Unauthorized'))
    return
  }
  const notifications = await notificationHelper.findNotifications({
    userId: requestedUserId,
  })
  res.json(notifications)
}

exports.getOne = async (req, res, next) => {
  if (!(req.requestedNotification.accouncement.partnerId == partnerId)) {
    next(new Error('Unauthorized'))
    return
  }
  res.json(req.requestedNotification)
}

// exports.put = async (req, res, next) => {
//   const partnerId = req.partner._id
//   if (
//     !(
//       Object.keys(req.policy).length > 0 &&
//       req.requestedNotification.partnerId == partnerId
//     )
//   ) {
//     next(new Error('Unauthorized'))
//     return
//   }
//   // can't change partner
//   delete req.body.partnerId
//   const updated = await notificationHelper.updateNotification(
//     { _id: req.params.id },
//     req.body
//   )
//   res.json(updated)
// }

// exports.post = async (req, res, next) => {
//   if (!(Object.keys(req.policy).length > 0)) {
//     next(new Error('Unauthorized'))
//     return
//   }
//   const newNotification = await notificationHelper.createNotification(req.body)
//   res.status(201).json(newNotification)
// }

exports.postToken = async (req, res, next) => {
  req.body.userId = req.user._id
  const newToken = await notificationHelper.createNotificationToken(req.body)
  res.status(201)
}

// exports.delete = async (req, res, next) => {
//   if (!(req.policy && req.policy.deleteData)) {
//     next(new Error('Unauthorized'))
//     return
//   }
//   const removed = await notificationHelper.deleteNotification({
//     _id: req.params.id,
//   })
//   res.json(removed)
// }

exports.makeNotificationRead = async(req, res, next)=>{
  const requestedUserId = req.query.userId
  if (!requestedUserId || req.user._id != requestedUserId) {
    next(new Error('Unauthorized'))
    return
  }
  await notificationHelper.updateNotification({notificationReceivedTime: null, userId: requestedUserId}, {notificationReceivedTime: new Date()});
  res.send(true);
}

exports.getUnReadNotification = async(req,res,next) => {
  const requestedUserId = req.query.userId
  if (!requestedUserId || req.user._id != requestedUserId) {
    next(new Error('Unauthorized'))
    return
  }
  const unReadNotificationCount   = await notificationHelper.findNotification({notificationReceivedTime: null,userId: requestedUserId,})
  res.send(unReadNotificationCount.length);
}