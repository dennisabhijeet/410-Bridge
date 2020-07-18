const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { Partner } = require('../partners/partner.model')
const { Trip } = require('../trip/trip.model')

class Message extends Model {}

Message.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    partnerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'partners',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tripId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
      values: ['image', 'video'],
    },
  },
  { sequelize, modelName: 'board_messages' }
)

Partner.hasMany(Message)
Message.belongsTo(Partner)

Message.belongsTo(Trip)
Trip.hasMany(Message)

module.exports = { Message }
