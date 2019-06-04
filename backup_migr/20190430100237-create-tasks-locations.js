'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks_locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      app_user_id: {
        type: Sequelize.INTEGER
      },
      latitude: {
        type: Sequelize.TEXT
      },
      longitude: {
        type: Sequelize.TEXT
      },
      date_time: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
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
    return queryInterface.dropTable('tasks_locations');
  }
};