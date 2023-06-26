const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')

const { Announcement } = require('../announcements/announcement.model')

class Notification extends Model {}

Notification.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    announcementId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'announcements',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: {
        name: 'user_announcement',
        msg: 'One user gets an announcement once',
      },
    },
    announcement_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: {
        name: 'user_announcement',
        msg: 'One user gets an announcement once',
      },
    },

    notificationSend: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    notificationSendTime: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    notificationReceived: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    notificationReceivedTime: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    readAt:{
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    }
  },
  { sequelize, modelName: 'notifications' }
)
Announcement.hasMany(Notification)
Notification.belongsTo(Announcement)

module.exports = { Notification }
