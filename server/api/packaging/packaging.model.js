const Sequelize = require('sequelize')
const { Model } = Sequelize
const sequelize = require('../../util/db')

class Packaging extends Model {}

Packaging.init(
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
    tripId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'packagings' }
)

class PackageItem extends Model {}

PackageItem.init(
  {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    checked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, modelName: 'package_items' }
)
Packaging.hasMany(PackageItem)

module.exports = Packaging
