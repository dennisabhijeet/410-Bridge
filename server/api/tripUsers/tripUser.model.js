const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
const { User } = require('../user/user.model')
const { TripRole } = require('../tripRole/tripRole.model')
const { Trip } = require('../trip/trip.model')

class TripUser extends Model {}
TripUser.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    additional: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: `you can't have less than 0 addition persons`,
        },
      },
    },
  },
  { sequelize, modelName: 'trip_users' }
)
User.belongsToMany(Trip, { through: TripUser })
TripUser.belongsTo(User)
Trip.belongsToMany(User, { through: TripUser })
TripUser.belongsTo(Trip)

class TripUserRole extends Model {}
TripUserRole.init({}, { sequelize, modelName: 'trip_user_roles' })
TripUser.belongsToMany(TripRole, { through: TripUserRole })
TripRole.belongsToMany(TripUser, { through: TripUserRole })

module.exports = { TripUser, TripUserRole }
