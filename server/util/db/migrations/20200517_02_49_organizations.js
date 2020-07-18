const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable(
    'organizations',
    {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      partnerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'partner_organization',
        references: {
          model: 'partners',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'partner_organization',
        validate: {
          notNull: {
            msg: 'Organization name is required',
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
    },
    {
      uniqueKeys: {
        partner_organization: {
          fields: ['partnerId', 'name'],
          message: 'Organization name cannot be same',
        },
      },
    }
  )
}

async function down(queryInterface) {
  await queryInterface.dropTable('organizations')
}

module.exports = { up, down }
