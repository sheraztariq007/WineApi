'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('user_roles', [
          {
        role_name: 'Admin'
      },
        {
          role_name: 'Manager'
        },
        {
          role_name: 'User'
        }
      ], {});

  },

  down: (queryInterface, Sequelize) => {

  }
};
