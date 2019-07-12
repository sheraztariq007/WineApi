'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('module_fieldnotebooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportedby_user_id: {
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER
      },
      marchinar_id: {
        type: Sequelize.TEXT
      },
      labore_id: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.STRING
      },
      end_date: {
        type: Sequelize.STRING
      },
      product: {
        type: Sequelize.STRING
      },
      app_method: {
        type: Sequelize.STRING
      },
      field_id: {
        type: Sequelize.INTEGER
      },
      surface: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      reported_date_time: {
        type: Sequelize.STRING
      },
      form_type:{
        type: Sequelize.INTEGER
      },
      trabajador:{
        type:Sequelize.TEXT
      },
      tratamiento:{
        type:Sequelize.TEXT
      },
      dosis:{
        type:Sequelize.TEXT
      },
      horasderiego:{
        type:Sequelize.TEXT
      },
      observaciones:{
        type:Sequelize.TEXT
      },
      tipodeabonado:{
        type:Sequelize.TEXT
      },
      subparcela:{
        type:Sequelize.TEXT
      },
      module_diseases_id:{
        type:Sequelize.INTEGER
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
    return queryInterface.dropTable('module_fieldnotebooks');
  }
};