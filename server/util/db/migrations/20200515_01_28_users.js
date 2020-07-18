const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('users', {
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
          msg: 'User name is required',
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Should be a valid Email address',
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    managed_mission_id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
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
  await queryInterface.dropTable('users')
}

module.exports = { up, down }
