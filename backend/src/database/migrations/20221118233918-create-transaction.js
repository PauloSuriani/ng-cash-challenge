'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      debitedAccountId: Sequelize.INTEGER,
      creditedAccountId: Sequelize.INTEGER,
      value: Sequelize.DECIMAL,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    },
      {
        tableName: 'transactions'
      });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
