const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('trip_organizations', {
    tripId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'trips',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    organizationId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'organizations',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
  await queryInterface.dropTable('trip_organizations')
}

module.exports = { up, down }
