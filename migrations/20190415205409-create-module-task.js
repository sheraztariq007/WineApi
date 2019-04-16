'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('module_tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      task_name: {
        type: Sequelize.TEXT
      },
      task_details: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      assign_from_id: {
        type: Sequelize.INTEGER
      },
      creation_date: {
        type: Sequelize.TEXT
      },
      completion_date: {
        type: Sequelize.TEXT
      },
      target_date: {
        type: Sequelize.TEXT
      },
      comment: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER
      },
      is_repeat: {
        type: Sequelize.BOOLEAN
      },
      is_enable: {
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
    return queryInterface.dropTable('module_tasks');
  }
};