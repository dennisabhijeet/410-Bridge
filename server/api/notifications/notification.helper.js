var { Notification } = require('./notification.model')
var { UserNotificationToken } = require('../user/user.model')
var _ = require('lodash')

// "text"
// "user"

exports.createNotification = async (notificationData) => {
  // create new notification
  const newNotification = new Notification(notificationData)
  const notification = await newNotification.save()
  return notification
}

exports.updateNotification = async (
  notificationOldData,
  notificationNewData
) => {
  let notification = _.merge(notificationOldData, notificationNewData)
  let saved = await notification.save()
  return saved
}

exports.deleteNotification = async (notification) => {
  const removed = await notification.remove()
  return removed
}

exports.findNotifications = async (where = {}) => {
  const notifications = await Notification.find(q)
  return notifications
}

exports.findNotification = async (where = {}) => {
  const notification = await Notification.findOne(q)
  return notification
}

exports.createNotificationToken = async (notificationTokenData) => {
  let response = {
    data: 'Failed',
  }
  let checkToken = { userId: '', token: '' }
  checkToken = await UserNotificationToken.findOne({
    where: {
      userId: notificationTokenData.userId,
    },
  })
  if (checkToken) {
    if (checkToken.token == notificationTokenData.token) {
      response.data = 'Same ID and Token exist'
      return response
    } else {
      const notificationToken = await UserNotificationToken.update(
        notificationTokenData,
        {
          where: {
            userId: notificationTokenData.userId,
          },
        }
      )
      response.data = 'Token Updated'
    }
  } else {
    const notificationToken = await UserNotificationToken.create(
      notificationTokenData
    )
    response.data = 'New User Token added'
  }
  return response
}
