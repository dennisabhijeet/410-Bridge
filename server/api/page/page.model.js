const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { TripRole } = require('../tripRole/tripRole.model')
const { Partner } = require('../partners/partner.model')

class Page extends Model {}

Page.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    icon: { type: Sequelize.STRING, allowNull: false },
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
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Page title is required',
        },
      },
    },
    body: {
      type: Sequelize.TEXT,
    },
    header: {
      type: Sequelize.STRING,
      validate: {
        // isUrl: {
        //   msg: 'Header can only be an URL',
        // },
      },
    },
    headerType: {
      type: Sequelize.STRING,
      values: ['image', 'video'],
    },
    pageType: {
      type: Sequelize.STRING,
      values: ['global', 'country'],
      defaultValue: 'global',
    },
    pageTypeId: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: 'pages' }
)

Page.belongsTo(Partner)
Partner.hasMany(Page)
Page.hasMany(Page)

class PageTripRole extends Model {}
PageTripRole.init({}, { sequelize, modelName: 'page_trip_roles' })
Page.belongsToMany(TripRole, { through: PageTripRole })
TripRole.belongsToMany(Page, { through: PageTripRole })

module.exports = { Page, PageTripRole }
