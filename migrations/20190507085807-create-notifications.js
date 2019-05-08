'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      n_title: {
        type: Sequelize.TEXT
      },
      n_message: {
        type: Sequelize.TEXT
      },
      n_type: {
        type: Sequelize.TEXT
      },
      n_type_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      task_id: {
        type: Sequelize.INTEGER
      },
      action_screen: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER
      },
      datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notifications');
  }
};