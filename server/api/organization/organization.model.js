const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { Partner } = require('../partners/partner.model')

class Organization extends Model {}

Organization.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    partnerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: {
        name: 'partner_organization',
        msg: 'Organization name must be unique',
      },
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
      unique: {
        name: 'partner_organization',
        msg: 'Organization name must be unique',
      },
      validate: {
        notNull: {
          msg: 'Organization name is required',
        },
      },
    },
  },
  { sequelize, modelName: 'organizations' }
)

Organization.belongsTo(Partner)
Partner.hasMany(Organization)

module.exports = { Organization }
