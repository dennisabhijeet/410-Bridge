const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')

class ManageMission extends Model {}

ManageMission.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Type is required',
        },
      },
    },
    managed_mission_id: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    pageNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    pageSize: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    pageCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: 'manage_mission' }
)

module.exports = { ManageMission }
