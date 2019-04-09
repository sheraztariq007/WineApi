const Sequelize = require('sequelize');
const sequilize = new Sequelize('test',"postgres","admin123",{
    host:"127.0.0.1",
    dialect:"postgres",
    operatorsAliases:false
});
module.exports = sequilize;
global.sequilize = sequilize;