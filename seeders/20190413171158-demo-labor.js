'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('labors', [
          {
        name: 'Otros'
      },
        {
          name: 'PDC 1'
        },
        {
          name: 'PDC 2'
        },
        {
          name: 'PSTM 1'
        },
        {
          name: 'PSTM 2'
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
