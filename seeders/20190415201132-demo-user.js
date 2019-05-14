'use strict';

module.exports = {
        up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('usuarios', [
            {
                email: 'test@gmail.com',
                password:'e10adc3949ba59abbe56e057f20f883e',
                company:'1',
                role_id:'2',
                name:'abdullah',
                surname:'masood'
            },
            {
                email: 'manager@gmail.com',
                password:'e10adc3949ba59abbe56e057f20f883e',
                company:'1',
                role_id:'2',
                name:'Tom',
                surname:'jery'
            }
            ,
            {
                email: 'user@gmail.com',
                password:'e10adc3949ba59abbe56e057f20f883e',
                company:'1',
                role_id:'3',
                name:'Tom',
                surname:'jery'
            },
             {
                email: 'albertoortega@valtravieso.com',
                password:'e10adc3949ba59abbe56e057f20f883e',
                company:'1',
                role_id:'2',
                name:'Alberto',
                surname:'Ortega'
             },
             {
                email: 'ricardovelasco@valtravieso.com',
                password:'e10adc3949ba59abbe56e057f20f883e',
                company:'1',
                role_id:'2',
                name:'Ricardo',
                surname:'Velasco'
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
