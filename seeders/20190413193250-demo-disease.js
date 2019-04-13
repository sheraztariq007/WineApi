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
        }, {
          name: 'Aracnosis'
        }], {});
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
