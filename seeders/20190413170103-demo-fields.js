'use strict';

module.exports = {
      up: (queryInterface, Sequelize) => {


      return queryInterface.bulkInsert('fields',[
          {
              name: 'Otros',
              company_id:1
          },
          {
              name: 'La Atalaya',
              company_id:1

          },
          {
              name: 'La Cotarra Alta',
              company_id:1
          },
          {
              name: 'El Lobón',
          },
          {
              name: 'El Cotarro (Merlot)',
              company_id:1
          }
          ,
          {
              name: 'El Cotarro (Tempranillo)',
              company_id:1
          }
          ,
          {
              name: 'Valdelobas',
              company_id:1
          }
          ,
          {
              name: 'La Asomada',
              company_id:1
          }
          ,
          {
              name: 'El Barco de Teralbo',
              company_id:1
          }
          ,
          {
              name: 'El Tajón',
              company_id:1
          }
          ,
          {
              name: 'San Botero',
              company_id:1
          }
          ,
          {
              name: 'El Molino',
              company_id:1
          }
          ,
          {
              name: 'La Cabrera',
              company_id:1
          }

      ], {});
},

down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Fields', null, {});
}
};
