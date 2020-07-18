const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('policies', {
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
          msg: 'Policy name is required',
        },
      },
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
    updatePartnerInfo: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    deleteData: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    sendNotification: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    makeTripActive: {
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
  await queryInterface.dropTable('policies')
}

module.exports = { up, down }
