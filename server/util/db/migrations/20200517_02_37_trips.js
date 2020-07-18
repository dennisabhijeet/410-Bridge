const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('trips', {
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
          msg: 'Trip name is required',
        },
      },
    },
    countryId: {
      type: Sequelize.INTEGER,
      // allowNull: false,
      references: {
        model: 'countries',
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
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    managed_mission_id: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
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
  await queryInterface.dropTable('trips')
}

module.exports = { up, down }
