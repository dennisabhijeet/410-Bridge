const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('announcements', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: ' Announcement title  is required',
        },
      },
    },
    tripId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    partnerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'partners',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tripRoleId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'trip_roles',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    announcement_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    announcement_sent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: ' Announcement description  is required',
        },
      },
    },
    data: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    ttl: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    subtitle: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    badge: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    sound: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    channelId: {
      type: Sequelize.STRING,
      allowNull: true,
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
  await queryInterface.dropTable('announcements')
}

module.exports = { up, down }
