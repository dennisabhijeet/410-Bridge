const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { Partner } = require('../partners/partner.model')
const { Trip } = require('../trip/trip.model')

class TripDoc extends Model {}

TripDoc.init(
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
      allowNull: false,
    },
  },
  { sequelize, modelName: 'trip_documents' }
)

Partner.hasMany(TripDoc)
TripDoc.belongsTo(Partner)

TripDoc.belongsTo(Trip)
Trip.hasMany(TripDoc)

module.exports = { TripDoc }
