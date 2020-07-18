// var mongoose = require('mongoose')
// var Schema = mongoose.Schema
const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')
var bcrypt = require('bcrypt')
const { Partner } = require('../partners/partner.model')
const { Policy } = require('../policy/policy.model')

class User extends Model {
  // check the passwords on sign-in
  authenticate(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.password)
  }

  // hash the passwords
  static encryptPassword(plainTextPassword) {
    if (!plainTextPassword) {
      return ''
    } else {
      var salt = bcrypt.genSaltSync(12)
      return bcrypt.hashSync(plainTextPassword, salt)
    }
  }

  toJson() {
    var obj = this.toJSON()
    delete obj.password
    delete obj.managed_mission_id
    return obj
  }
}

User.init(
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
          msg: 'User name is required',
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Should be a valid Email address',
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 8,
          msg: 'Password Must be minimum of 8 charecters',
        },
      },
    },
    managed_mission_id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        // isUrl: true,
      },
    },
  },
  {
    sequelize,
    hooks: {
      beforeSave(user) {
        if (user.changed('password')) {
          user.password = this.encryptPassword(user.password)
        }
      },
    },
    modelName: 'users',
  }
)

class UserPolicy extends Model {}
UserPolicy.init({}, { sequelize, modelName: 'user_policies' })
User.belongsToMany(Policy, { through: UserPolicy })
Policy.belongsToMany(User, { through: UserPolicy })

class UserPartner extends Model {}
UserPartner.init({}, { sequelize, modelName: 'user_partners' })
Partner.belongsToMany(User, { through: UserPartner })
User.belongsToMany(Partner, { through: UserPartner })

class UserNotificationToken extends Model {}
UserNotificationToken.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'user_notification_tokens' }
)
User.hasMany(UserNotificationToken)
UserNotificationToken.belongsTo(User)

class UserForgetPass extends Model {}
UserForgetPass.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    urlKey: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize, modelName: 'user_forget_pass' }
)
User.hasMany(UserForgetPass)

module.exports = {
  User,
  UserPartner,
  UserPolicy,
  UserForgetPass,
  UserNotificationToken,
}
