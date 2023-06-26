const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')

class PrivacyPolicy extends Model {}

PrivacyPolicy.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    body: {
      type: Sequelize.TEXT,
    },
  },
  { sequelize, modelName: 'privacy_policy', timestamps: true }
)


module.exports = { PrivacyPolicy }
