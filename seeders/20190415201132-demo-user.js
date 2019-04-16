'use strict';

module.exports = {
        up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Usuarios', [
            {
                email: 'test@gmail.com',
                password:'aadc03fecca9b5cc2fd64b333cb0875e',
                company:'1',
                role_id:'2',
                name:'abdullah',
                surname:'masood'
            },
            {
                email: 'manager@gmail.com',
                password:'aadc03fecca9b5cc2fd64b333cb0875e',
                company:'1',
                role_id:'2',
                name:'Tom',
                surname:'jery'
            }
            ,
            {
                email: 'user@gmail.com',
                password:'aadc03fecca9b5cc2fd64b333cb0875e',
                company:'1',
                role_id:'3',
                name:'Tom',
                surname:'jery'
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
