'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('maintenances', [
          {
        name: 'Otros'
      },
        {
          name: 'Rotura de riego'
        },
        {
          name: 'Subir espalderas'
        },
        {
          name: 'Alambre roto'
        },
        {
          name: 'Cepa Dañada'
        }
      ], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
