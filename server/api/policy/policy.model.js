const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { Partner } = require('../partners/partner.model')

class Policy extends Model {}

Policy.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Policy name is required',
        },
      },
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
    createPartner: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    updatePartnerInfo: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    deleteData: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    sendNotification: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    makeTripActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, modelName: 'policies' }
)

Partner.hasMany(Policy)
Policy.belongsTo(Partner)

module.exports = { Policy }
