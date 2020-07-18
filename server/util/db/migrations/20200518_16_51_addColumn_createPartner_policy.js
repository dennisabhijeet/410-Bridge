const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.addColumn('policies', 'createPartner', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  })
}

async function down(queryInterface) {
  await queryInterface.removeColumn('policies', 'createPartner')
}

module.exports = { up, down }
