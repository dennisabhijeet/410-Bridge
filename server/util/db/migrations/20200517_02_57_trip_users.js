const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('trip_users', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tripId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'trips',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    additional: {
      type: Sequelize.INTEGER,
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
  await queryInterface.dropTable('trip_users')
}

module.exports = { up, down }
