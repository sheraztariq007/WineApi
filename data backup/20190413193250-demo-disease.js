'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('diseases', [{
        name: 'Otros'
      },{
        name: 'Mildiu'
      },
        {
          name: 'Botrytis'
        },
        {
          name: 'Excoriosis'
        },
        {
          name: 'Clorosis'
        },
        {
          name: 'Aracnosis'
        },
        {
          name: 'Mosquito verde'
        },
        {
          name: 'Oidio'
        },
        {
          name: 'Polilla del racimo'
        }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('diseases', null, {});
  }
};
