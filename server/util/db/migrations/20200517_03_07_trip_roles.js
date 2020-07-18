const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('trip_roles', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Trip Role name is required',
        },
      },
    },
    partnerId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'partners',
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
  await queryInterface.dropTable('trip_roles')
}

module.exports = { up, down }
