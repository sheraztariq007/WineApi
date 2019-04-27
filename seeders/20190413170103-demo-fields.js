'use strict';

module.exports = {
      up: (queryInterface, Sequelize) => {


      return queryInterface.bulkInsert('fields',[
          {
              name: 'Otros',
              company_id:2
          },
          {
              name: 'PDC 1',
              company_id:2

          },
          {
              name: 'PDC 2',
              company_id:2
          },
          {
              name: 'PSTM 1',
          },
          {
              name: 'PSTM 2',
              company_id:1
          }
      ], {});
},

down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Fields', null, {});
}
};
