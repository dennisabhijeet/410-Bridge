const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable(
    'countries',
    {
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
        // unique: 'partner_country',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: 'partner_country',
        validate: {
          notNull: {
            msg: 'Country name is required',
          },
        },
      },
      image: {
        type: Sequelize.STRING,
      },
      flag: {
        type: Sequelize.STRING,
        validate: {
          isUrl: {
            msg: 'Flag must have valid URL',
          },
        },
      },
      longLat: {
        type: Sequelize.GEOMETRY('POINT'),
      },
      timezone: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      currencySym: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      uniqueKeys: {
        partner_country: {
          fields: ['partnerId', 'name'],
          message: 'Country name cannot be same',
        },
      },
    }
  )
}

async function down(queryInterface) {
  await queryInterface.dropTable('countries')
}

module.exports = { up, down }
