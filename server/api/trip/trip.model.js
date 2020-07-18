const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { Organization } = require('../organization/organization.model')
const { User } = require('../user/user.model')
const { Partner } = require('../partners/partner.model')
const { Community } = require('../community/community.model')
const { Country } = require('../country/country.model')
const { TripRole } = require('../tripRole/tripRole.model')

class Trip extends Model {}

Trip.init(
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
          msg: 'Trip name is required',
        },
      },
    },
    countryId: {
      type: Sequelize.INTEGER,
      // allowNull: false,
      references: {
        model: 'countries',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    managed_mission_id: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
    },
  },
  { sequelize, modelName: 'trips' }
)

Country.hasMany(Trip)
Trip.belongsTo(Country)

Partner.hasMany(Trip)
Trip.belongsTo(Partner)

class TripOrg extends Model {}
TripOrg.init({}, { sequelize, modelName: 'trip_organizations' })
Trip.belongsToMany(Organization, { through: TripOrg })
Organization.belongsToMany(Trip, { through: TripOrg })

class TripCommunity extends Model {}
TripCommunity.init({}, { sequelize, modelName: 'trip_communities' })
Trip.belongsToMany(Community, { through: TripCommunity })
Community.belongsToMany(Trip, { through: TripCommunity })

module.exports = { Trip, TripCommunity, TripOrg }
