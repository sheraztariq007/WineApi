const  seq = require('../models/index');
const  Usuarios = require('../models/usuarios');
module.exports = {
    getUserLists:function(){
    const users = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
    users.findAll().then(result=>{
        console.log(result);
    }).catch(err=>{
console.log(err);
    });
}
}