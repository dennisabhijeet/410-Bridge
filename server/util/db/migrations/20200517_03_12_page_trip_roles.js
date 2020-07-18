const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('page_trip_roles', {
    pageId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'pages',
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
  await queryInterface.dropTable('page_trip_roles')
}

module.exports = { up, down }
