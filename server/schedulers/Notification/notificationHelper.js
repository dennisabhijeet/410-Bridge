var { Op } = require('sequelize')
// var Sequelize = require('sequelize')
// var sequelize = require('../../util/db')
const notification = require('../../services/notification')

const announcementHelper = require('../../api/announcements/announcement.helper')
const { Notification } = require('../../api/notifications/notification.model')
const { TripUser } = require('../../api/tripUsers/tripUser.model')
const { Trip } = require('../../api/trip/trip.model')
const { TripRole } = require('../../api/tripRole/tripRole.model')
const { User, UserNotificationToken } = require('../../api/user/user.model')
const moment = require('moment')
const { findGte, findLte } = require('../../util/helpers')
const { findMessage } = require('../../api/messageBoard/message.helper')

const getAnnouncementsInRange = async (start_date, end_date) => {
  const { announcements } = await announcementHelper.findAnnouncements({
    where: {
      [Op.and]: [
        findGte('announcement_date', moment(start_date).toDate()),
        findLte('announcement_date', moment(end_date).toDate()),
        {
          announcement_sent: false,
        },
      ],
    },
  })
  return announcements.map((el) => el.toJSON())
}
const updateAnnouncementsInRange = async (announcements) => {
  const updatePromises = announcements.map((announcement) => {
    return announcementHelper.updateAnnouncement(
      { _id: announcement._id },
      { announcement_sent: true }
    )
  })
  return await Promise.all(updatePromises)
}

const getFomatedAnnouncementsAndUser = async (announcements = []) => {
  // const announcements = await getAnnouncementsForToday()
  const tripUsersPromises = announcements.map((announcement) => {
    if (announcement.tripRoleId) {
      return TripUser.findAll({
        where: {
          tripId: announcement.tripId,
        },
        include: [
          {
            model: Trip,
            attributes: ['_id', 'name', 'partnerId'],
            where: { partnerId: announcement.partnerId },
          },
          {
            model: User,
            attributes: ['_id', 'name'],
            include: {
              model: UserNotificationToken,
              required: true,
            },
            required: true,
          },
          {
            model: TripRole,
            where: { _id: announcement.tripRoleId },
            as: 'trip_roles',
            attributes: ['_id', 'name'],
          },
        ],
      })
    }
    return TripUser.findAll({
      where: {
        tripId: announcement.tripId,
      },
      include: [
        {
          model: Trip,
          attributes: ['_id', 'name', 'partnerId'],
          where: { partnerId: announcement.partnerId },
        },
        {
          model: User,
          attributes: ['_id', 'name'],
          include: {
            model: UserNotificationToken,
            required: true,
          },
          required: true,
        },
      ],
    })
  })
  const tripUsers = await Promise.all(tripUsersPromises)

  const formatedAnnouncements = []
  const UserData = []
  for (let i = 0; i < tripUsers.length; i++) {
    const userList = tripUsers[i]
    const announcement = announcements[i]
    let message;
    if (announcement.message_id) {
      message = await findMessage(announcement.message_id)
    }
    for (let j = 0; j < userList.length; j++) {
      const { user } = userList[j]
      const { trip } = userList[j]
      const notification = {
        to: user.user_notification_tokens[0].token,
        title: announcement.title,
        body: announcement.body,
        data: {
          partnerId: announcement.partnerId,
          tripId: trip._id,
          tripName: trip.name,
          announcementId: announcement._id || '',
          messageId: message._id || '',
        },
        sound: announcement.sound || 'default',
        ttl: announcement.ttl || 0,
        badge: 1,
      }
      if (announcement.channelId) {
        notification.channelId = announcement.channelId
      }
      // if (announcement.badge) {
      //   notification.badge = announcement.badge
      // }
      if (announcement.subtitle) {
        notification.subtitle = announcement.subtitle
      }
      formatedAnnouncements.push(notification)
      UserData.push({
        userId: user._id,
        announcementId: announcement._id,
      })
    }
  }
  return { notifications: formatedAnnouncements, userData: UserData }
}

const sendNotification = async ({ notifications = [], userData = [] }) => {
  // let { notifications, userData } = await getFomatedAnnouncementsAndUser()
  notifications.forEach((n, i) => {
    notification
      .sendNotification(n)
      .then(() => {
        Notification.create({
          ...userData[i],
          notificationSend: true,
          notificationSendTime: moment().toDate(),
        })
      })
      .catch(console.error)
  })
}

module.exports = {
  getAnnouncementsInRange,
  getFomatedAnnouncementsAndUser,
  sendNotification,
  updateAnnouncementsInRange,
}
