const  seq = require('../models/index');
const  Usuarios = require('../models/usuarios');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
var md5 = require("md5")

module.exports = {
    getUserLists:function(){
        const users = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        users.findAll().then(result=>{
            console.log(result);
    }).catch(err=>{
            console.log(err);
    });
    },

    loginUser:function(email,password,res){
        const users = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        users.findOne({where:{
            'email':email,
            'password':md5(password)
        }}).then(result=> {
            if(result!=null)
        {
            res.send({
                'status':200,
                 'data':result
            })
            console.log(result.email);
        }
        else
        { res.send({
            'status':204,
            'message':'Sorry user not found'
        })
            console.log("sorry");

        }
    }).catch(err=>{
            console.log(err);
    });
    }



}