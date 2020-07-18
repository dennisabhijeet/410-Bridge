const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { Page } = require('../page/page.model')
const { Partner } = require('../partners/partner.model')

class Country extends Model {}

Country.init(
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
      unique: {
        name: 'partner_country',
        msg: 'Country name must be unique',
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        name: 'partner_country',
        msg: 'Country name must be unique',
      },
      validate: {
        notNull: {
          msg: 'Country name is required',
        },
      },
    },
    image: {
      type: Sequelize.STRING,
    },
    flag: {
      type: Sequelize.STRING,
      validate: {
        isUrl: {
          msg: 'Flag must have valid URL',
        },
      },
    },
    longLat: {
      type: Sequelize.GEOMETRY('POINT'),
    },
    timezone: {
      type: Sequelize.STRING,
    },
    currency: {
      type: Sequelize.STRING,
    },
    currencySym: {
      type: Sequelize.STRING,
    },
  },
  { sequelize, modelName: 'countries' }
)
Partner.hasMany(Country)
Country.belongsTo(Partner)

class CountryPage extends Model {}
CountryPage.init(
  {
    type: {
      type: Sequelize.STRING,
    },
  },
  { sequelize, modelName: 'country_pages' }
)
Country.belongsToMany(Page, { through: CountryPage })
Page.belongsToMany(Country, { through: CountryPage })

module.exports = { Country, CountryPage }
