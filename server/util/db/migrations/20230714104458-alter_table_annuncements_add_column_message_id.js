'use strict';

const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.addColumn('announcements','message_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'board_messages',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
}

async function down(queryInterface) {
  await queryInterface.removeColumn('announcements', 'message_id')
}

module.exports = { up, down }