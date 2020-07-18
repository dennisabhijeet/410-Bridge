const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('trip_communities', {
    tripId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'trips',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    communityId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'communities',
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
  await queryInterface.dropTable('trip_communities')
}

module.exports = { up, down }
