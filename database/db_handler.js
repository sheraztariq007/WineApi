const  seq = require('../models/index');
var dateTime = require('node-datetime');
var time = new Date();
const  Usuarios = require('../models/usuarios');
const  Moduledisease = require('../models/module_disease');
const  Modulefieldnotebook = require('../models/module_fieldnotebook');
const  Modulemaintain = require('../models/module_maintain');
const  Modulesampling = require('../models/module_sampling');
const  Fields = require('../models/field');
const  Labor = require('../models/labor');
const  Maintenance = require('../models/maintenance');
const  Diseases = require('../models/disease');
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
    },
    saveMaintaince:function(userid,maintane_type,details,imageUrl,location,res){
        const  maintain = Modulemaintain(seq.sequelize,seq.sequelize.Sequelize);
        maintain.create({
            reportedBy_user_id:userid,maintane_type:maintane_type
            ,details:details,image_url:imageUrl,
            location:location,reported_date_time:getDate()+" "+getTime()
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
    saveSampling:function(req,res){
        const  sampling = Modulesampling(seq.sequelize,seq.sequelize.Sequelize);
        sampling.create({
            reportedBy_user_id:req.body.userId,sample_name:req.body.sample_name,
            sample_type:req.body.sample_type,cluster_per_unit_edit:req.body.cluster_per_unit_edit,
                boxes_per_field:req.body.boxes_per_field,
            kilogram_transport:req.body.kilogram_transport,machinery:req.body.machinery,
            field_type:req.body.field_type
            ,location:req.body.location,reported_datetime:getDate()+" "+getTime(),sample_type_field_id:req.body.sample_type_field_id,
            sample_type_lning:req.body.sample_type_lning,sample_type_strain:req.body.sample_type_strain,sample_type_no_of_breaks:req.body.sample_type_no_of_breaks,
            weight_purning:req.body.weight_purning,drop_buds:req.body.drop_buds,number_of_buds:req.body.number_of_buds,
            number_of_bunches:req.body.number_of_bunches
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
    fieldlist:function(res){
        const fld =  Fields(seq.sequelize,seq.sequelize.Sequelize);
        fld.findAll().then(result=>{
            res.send({
            'status':200,
            "data":result
        });
        }).catch (err=>{

        });
    },
    laborlist:function(res){
        const labor =  Labor(seq.sequelize,seq.sequelize.Sequelize);
        labor.findAll().then(result=>{
            res.send({
            'status':200,
            "data":result
        });
    }).catch (err=>{

        });
    },
    maintenancelist:function(res){
        const maintenance =  Maintenance(seq.sequelize,seq.sequelize.Sequelize);
        maintenance.findAll().then(result=>{
            res.send({
            'status':200,
            "data":result
        });
    }).catch (err=>{

        });
    },
    diseaseslist:function(res){
        const diseases =  Diseases(seq.sequelize,seq.sequelize.Sequelize);
        diseases.findAll().then(result=>{
            res.send({
            'status':200,
            "data":result
        });
    }).catch (err=>{

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