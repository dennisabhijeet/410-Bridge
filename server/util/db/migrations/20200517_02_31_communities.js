const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('communities', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    countryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'countries',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Community name is required',
        },
      },
    },
    link: {
      type: Sequelize.STRING,
      validate: {
        isUrl: {
          msg: 'Community Link must be valid URL',
        },
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
  await queryInterface.dropTable('communities')
}

module.exports = { up, down }
