const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')

class Partner extends Model {}

Partner.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Partner name is required',
        },
      },
    },
    logo: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        // isUrl: true,
      },
    },
    theme: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        primary: '#E5C220',
        secondary: '#525252',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  { sequelize, modelName: 'partners' }
)

module.exports = { Partner }
