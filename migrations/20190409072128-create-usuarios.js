'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.INTEGER
      },
      field_id: {
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      group: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      last_login_date: {
        type: Sequelize.DATE
      },
      signUp_date: {
        type: Sequelize.DATE
      },
      account_disabled: {
        type: Sequelize.BOOLEAN
      },
      module_task: {
        type: Sequelize.BOOLEAN
      },
      module_diseases: {
        type: Sequelize.BOOLEAN
      },
      module_fieldNotebook: {
        type: Sequelize.BOOLEAN
      },
      module_maintenance: {
        type: Sequelize.BOOLEAN
      },
      module_gathering: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Usuarios');
  }
};