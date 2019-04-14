'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('labors', [
          {
        name: 'Otros'
      },
        {
          name: 'Abonados'
        },
        {
          name: 'Fertilizantes'
        },
        {
          name: 'Fitosanitarios'
        }
        ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('labors', null, {});
  }
};
