'use strict';

module.exports = {
        up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('tasks', [
            {
                name: 'ABONO ORGÁNICO'
            },
            {
                name: 'TRABAJO COLMENAS'
            },
            {
                name: 'ARANCAR PLANTAS'
            },
            {
                name: 'ATADO DE FORMACIÓN'
            },
            {
                name: 'ATAR TUTORES'
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
