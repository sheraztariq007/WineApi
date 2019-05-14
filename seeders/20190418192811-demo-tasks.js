'use strict';

module.exports = {
        up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('tasks', [

            {
                name: 'NONE'
            },
            {
                name: 'Podar'
            },

            {
                name: 'Tirar palos'
            },
            {
                name: 'Sacar palos'
            },
            {
                name: 'Replantar'
            },
            {
                name: 'Atar'
            },
            {
                name: 'Bajar alambre'
            },
            {
                name: 'Cortar bravo tijera'
            },
            {
                name: 'Recoger piedra'
            },
            {
                name: 'Acodar'
            },
            {
                name: 'Poda verde'
            },
            {
                name: 'Subir alambre'
            },
            {
                name: 'Quitar malas hierbas'
            },
            {
                name: 'Tratamientos fitosanitarios'
            },
            {
                name: 'Despuntar'
            },
            {
                name: 'Desnietar'
            },
            {
                name: 'Deshojar'
            },
            {
                name: 'Vendimiar'
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
