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
        },
        {
          name: 'Reposición de Marras'
        }
      ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('maintenances', null, {});
  }
};
