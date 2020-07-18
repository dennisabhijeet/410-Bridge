const Sequelize = require('sequelize')
const { Model } = Sequelize
const { Partner } = require('../partners/partner.model')
const sequelize = require('../../util/db')

class TripRole extends Model {}
TripRole.init(
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Trip Role name is required',
        },
      },
    },
  },
  { sequelize, modelName: 'trip_roles' }
)

Partner.hasMany(TripRole)
TripRole.belongsTo(Partner)

module.exports = { TripRole }
