const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('users', {
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
  await queryInterface.dropTable('users')
}

module.exports = { up, down }
