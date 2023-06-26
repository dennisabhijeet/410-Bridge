const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('privacy_policy', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    body: {
      type: Sequelize.TEXT,
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
  await queryInterface.dropTable('privacy_policy')
}

module.exports = { up, down }
