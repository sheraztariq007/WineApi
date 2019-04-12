'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('module_samplings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportedBy_user_id: {
        type: Sequelize.INTEGER
      },
      sample_name: {
        type: Sequelize.TEXT
      },
      sample_type: {
        type: Sequelize.INTEGER
      },
      cluster_per_unit_edit: {
        type: Sequelize.TEXT
      },
      boxes_per_field: {
        type: Sequelize.TEXT
      },
      kilogram_transport: {
        type: Sequelize.TEXT
      },
      machinery: {
        type: Sequelize.TEXT
      },
      field_type: {
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.TEXT
      },
      reported_datetime: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('module_samplings');
  }
};