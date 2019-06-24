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
      reportedby_user_id: {
        type: Sequelize.INTEGER
      },
      sample_name: {
        type: Sequelize.TEXT
      },
      company_id: {
        type: Sequelize.TEXT
      },
      phenological_type: {
        type: Sequelize.TEXT
      },
      thumbnail_url: {
        type: Sequelize.TEXT
      },image_url: {
        type: Sequelize.TEXT
      },
      sample_type: {
        type: Sequelize.TEXT
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
      sample_type_field_id: {
        type: Sequelize.INTEGER
      },
      sample_type_date: {
        type: Sequelize.TEXT
      },
      sample_type_lning: {
        type: Sequelize.INTEGER
      },
      sample_type_strain: {
        type: Sequelize.INTEGER
      },
      sample_type_no_of_breaks: {
        type: Sequelize.INTEGER
      },
      weight_purning: {
        type: Sequelize.INTEGER
      },
      drop_buds: {
        type: Sequelize.INTEGER
      },
      number_of_buds: {
        type: Sequelize.INTEGER
      },
      number_of_bunches: {
        type: Sequelize.INTEGER
      },
      valor_scholander:{
        type: Sequelize.TEXT
      },
      ubicacion:{
        type: Sequelize.TEXT
      },
      hora:{
        type: Sequelize.TEXT
      },
      temparature:{
        type: Sequelize.TEXT
      },
      humedad_ambiental:{
        type: Sequelize.TEXT
      },
      observation:{
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