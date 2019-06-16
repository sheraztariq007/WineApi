'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      contactmail: {
        type: Sequelize.STRING
      },
      module_tasks:{
        type: Sequelize.BOOLEAN
      },
      module_disease:{
        type: Sequelize.BOOLEAN
      },
      module_mantain:{
        type: Sequelize.BOOLEAN
      },
      module_sampling:{
        type: Sequelize.BOOLEAN
      },
      module_notefield:{
        type: Sequelize.BOOLEAN
      },
      contactphone: {
        type: Sequelize.TEXT
      },
      splash_image: {
        type: Sequelize.TEXT
      },
      mainscreen_image: {
        type: Sequelize.TEXT
      },
      splash_color: {
        type: Sequelize.TEXT
      },
      createDate: {
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
    return queryInterface.dropTable('companies');
  }
};