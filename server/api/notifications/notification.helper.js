var { Notification } = require('./notification.model')
var { Announcement } = require('../announcements/announcement.model')
var { UserNotificationToken } = require('../user/user.model')
var _ = require('lodash')
const { Trip } = require('../trip/trip.model')
const { Message } = require('../messageBoard/message.model')

/**
 * announcementId
 * announcement_date
 * userId
 * notificationSend
 * notificationSendTime
 * notificationReceived
 * notificationReceivedTime
 */

exports.createNotification = async (notificationData) => {
  let notification = await Notification.create(notificationData)
  return notification
}

exports.updateNotification = async (where = {}, notificationNewData) => {
  await Notification.update(notificationNewData, { where })
  return notificationNewData
}

exports.deleteNotification = async (where = {}) => {
  await Notification.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findNotifications = async (where = {}) => {
  let notifications = await Notification.findAll({
    where,
    include: [
      {
        model: Announcement,
        include: [
          { model: Trip, required: true },
          { model: Message, required: false },
        ],
      },
    ],
    limit: 100,
    order: [['_id', 'DESC']],
  })

  return notifications
}

exports.findNotification = async (where = {}) => {
  const notification = await Notification.findOne({
    where,
    include: [
      {
        model: Announcement,
        include: {
          model: Trip,
          required: true,
        },
      },
    ],
  })
  return notification ? notification : {}
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
