'use strict';

module.exports = {
      up: (queryInterface, Sequelize) => {


      return queryInterface.bulkInsert('Fields',[
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
   return queryInterface.bulkDelete('Fields', null, {});
}
};
