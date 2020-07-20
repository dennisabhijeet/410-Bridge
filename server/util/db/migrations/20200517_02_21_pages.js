const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable(
    'pages',
    {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      icon: { type: Sequelize.STRING, allowNull: false },
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
      pageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'pages',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Page title is required',
          },
        },
      },
      body: {
        type: Sequelize.TEXT,
      },
      header: {
        type: Sequelize.STRING,
        validate: {
          isUrl: {
            msg: 'Header can only be an URL',
          },
        },
      },
      headerType: {
        type: Sequelize.STRING,
        values: ['image', 'video'],
      },
      pageType: {
        type: Sequelize.STRING,
        values: ['global', 'country', 'support'],
        defaultValue: 'global',
      },
      pageTypeId: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
      charset: 'utf8mb4',
    }
  )
}

async function down(queryInterface) {
  await queryInterface.dropTable('pages')
}

module.exports = { up, down }
