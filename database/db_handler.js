const  seq = require('../models/index');
var dateTime = require('node-datetime');
var time = new Date();
const  Usuarios = require('../models/usuarios');
const  Moduledisease = require('../models/module_disease');
const  Modulefieldnotebook = require('../models/module_fieldnotebook');
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
    },
    getDiseaseList:function(userid,disease_type,details,imageUrl,location,res){
        const  disease = Moduledisease(seq.sequelize,seq.sequelize.Sequelize);
        disease.create({
            reportedBy_user_id:userid,disease_type:disease_type
            ,maintenace:details,image_url:imageUrl,
            location:location,reported_datetime:getDate()+" "+getTime()
        }).then(result=>{
            console.log("done");
        res.send({
            'status':200,
            'message':'Successfully send'
        })
        }).catch (err=>{
            console.log(err);
        });
},
    saveFieldNodeBook:function (req,res) {
        const  field = Modulefieldnotebook(seq.sequelize,seq.sequelize.Sequelize);
        field.create({
            reportedby_user_id:req.body.reportedby_user_id,marchinar_id:req.body.marchinar_id,
            labore_id:req.body.labore_id,start_date:req.body.start_date,end_date:req.body.end_date,product:req.body.product,
            app_method:req.body.app_method,field_id:req.body.field_id,surface:req.body.surface,location:req.body.location,
            reported_date_time:getDate()+" "+getTime()
        }).then(result=>{
            res.send({
            'status':200,
            'message':'Successfully send'
        })
        }).catch(err=>{
            console.log(err);
        });
    }
}
function getTime() {
    var time = new Date();
    console.log(time.toLocaleString('en-US', { month: 'long', hour12: true }));
    console.log(time.toLocaleString('en-US', { weekday: 'long', hour12: true }));
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function getDate() {
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d');
    console.log(formatted);
    return formatted;
}