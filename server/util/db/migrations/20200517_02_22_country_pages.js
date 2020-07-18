const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('country_pages', {
    countryId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'countries',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    pageId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'pages',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    type: {
      type: Sequelize.STRING,
      validate: {
        notNull: {
          msg: 'Country name is required',
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
  await queryInterface.dropTable('country_pages')
}

module.exports = { up, down }
