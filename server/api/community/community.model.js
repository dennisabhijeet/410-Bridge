const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { Country } = require('../country/country.model')
const { Partner } = require('../partners/partner.model')

class Community extends Model {}

Community.init(
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
          msg: 'Community name is required',
        },
      },
    },
    link: {
      type: Sequelize.STRING,
      validate: {
        isUrl: {
          msg: 'Community Link must be valid URL',
        },
      },
    },
  },
  { sequelize, modelName: 'communities' }
)

Partner.hasMany(Community)
Community.belongsTo(Partner)

Country.hasMany(Community)
Community.belongsTo(Country)

module.exports = { Community }
