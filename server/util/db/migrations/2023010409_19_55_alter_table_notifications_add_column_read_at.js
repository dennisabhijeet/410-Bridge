const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.addColumn('notifications','readAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    })
}

async function down(queryInterface) {
  await queryInterface.removeColumn('notifications', 'readAt')
}

module.exports = { up, down }