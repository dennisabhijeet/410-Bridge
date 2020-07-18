const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('manage_mission', {
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
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  })
}

async function down(queryInterface) {
  await queryInterface.dropTable('manage_mission')
}

module.exports = { up, down }
