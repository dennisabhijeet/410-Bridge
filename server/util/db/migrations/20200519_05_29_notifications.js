const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('notifications', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    announcementId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'announcements',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    announcement_date: {
      type: Sequelize.DATE,
      allowNull: true,
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

    notificationSend: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    notificationSendTime: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    notificationReceived: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    notificationReceivedTime: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
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
  await queryInterface.dropTable('notifications')
}

module.exports = { up, down }
