'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('upgrade_app', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      version_code: {
        type: Sequelize.TEXT
      },
      version_name: {
        type: Sequelize.TEXT
      },
      message: {
        type: Sequelize.TEXT
      },
      allow_update: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")

      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('upgrade_app');
  }
};