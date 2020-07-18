const { Sequelize } = require('sequelize')

async function up(queryInterface) {
  await queryInterface.createTable('user_policies', {
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: '_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    policyId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'policies',
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
  await queryInterface.dropTable('user_policies')
}

module.exports = { up, down }
