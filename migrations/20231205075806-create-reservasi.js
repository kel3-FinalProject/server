'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservasis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
      },
      kamarId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kamars',
          key: 'id'
        },
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tanggal_checkin: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tanggal_checkout: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reservasis');
  }
};