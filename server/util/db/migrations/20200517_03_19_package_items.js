const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('package_items', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packagingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'packagings',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    checked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
  await queryInterface.dropTable('package_items')
}

module.exports = { up, down }
