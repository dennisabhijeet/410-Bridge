const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('trip_user_roles', {
    tripUserId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'trip_users',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tripRoleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'trip_roles',
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
  await queryInterface.dropTable('trip_user_roles')
}

module.exports = { up, down }
