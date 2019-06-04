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
const  Moduletasks = require('../models/module_task');
const  AssignTasksUsersLists = require('../models/assign_tasks_users_lists');
const  UserTasksDates = require('../models/user_tasks_date');
const  UserTasksFields = require('../models/user_tasks_fields');
const  Tasks = require('../models/tasks');
const  user_role = require('../models/user_role');
const  TasksLocations =  require('../models/tasks_locations');
const  Notifications =  require('../models/notifications');
const  AppVersion =  require('../models/app_version');
const  constants = require('../config/constants.json')
const  db_sql = require('./db_sql')
const saltRounds = 10;
const Op =  seq.Sequelize.Op;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
var md5 = require("md5")
var thumbnail_folder="thumbnails/";
module.exports = {
    /*
     * Get user Lists
     * */
    getUserLists:function(){
        const users = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        users.findAll().then(result=>{
            console.log(result);
    }).catch(err=>{
            console.log(err);
    });
    },

    /*  Login User APi*/

    loginUser:function(email,password,res){
        //,include: [{model:role, as: 'role'}]
        const users = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        const role = user_role(seq.sequelize,seq.sequelize.Sequelize);
        users.hasMany(role, {foreignKey: 'id', as: 'role'});
        users.findOne({where:{
            'email':email,
            'password':"aadc03fecca9b5cc2fd64b333cb0875e"
        },include: [{model:role, as: 'role'}]}).then(result=> {
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
    /*save All Disease Requests*/
    getDiseaseList:function(userid,disease_type,details,imageUrl,location,companyId,res){
        const  disease = Moduledisease(seq.sequelize,seq.sequelize.Sequelize);
        disease.create({
            reportedby_user_id:userid,disease_type:disease_type,
            maintenace:details,
            company_id:companyId,
            image_url:imageUrl,
            thumbnial:thumbnail_folder+imageUrl,
            carto_image:constants.base_url+imageUrl,
            location:location,reported_datetime:getDate()+" "+getTime()
        }).then(result=>{
            console.log("done");
        res.send({
            'status':200,
            'message':'Successfully send'
        })
        db_sql.sendNotifications("Plagas y Enfermedades","Disease uploaded from users","PlagasyEnfermedades",result.id,companyId,"disease_details")
    }).catch (err=>{
            console.log(err);
    });
    },
    /*Save all Notebook Request*/
    saveFieldNodeBook:function (req,res) {
        const  field = Modulefieldnotebook(seq.sequelize,seq.sequelize.Sequelize);
        field.create({
            reportedby_user_id:req.body.reportedby_user_id,marchinar_id:req.body.marchinar_id,
            labore_id:req.body.labore_id,start_date:req.body.start_date,end_date:req.body.end_date,product:req.body.product,
            app_method:req.body.app_method,field_id:req.body.field_id,surface:req.body.surface,location:req.body.location,
            reported_date_time:getDate()+" "+getTime(),company_id:req.body.company_id
        }).then(result=>{
            res.send({
            'status':200,
            'message':'Successfully send'
        })
        console.log(req.body)
        db_sql.sendNotifications("Cuaderno","Notebook uploaded from users"
            ,"Cuaderno",result.id,req.body.company_id,"notebook")
    }).catch(err=>{
            console.log(err);
    });
    },
    /*Save All Maintaince Request */

    saveMaintaince:function(userid,maintane_type,details,imageUrl,location,companyId,res){
        const  maintain = Modulemaintain(seq.sequelize,seq.sequelize.Sequelize);
        maintain.create({
            reportedby_user_id:userid,maintane_type:maintane_type,
            details:details,
            company_id:companyId,
            image_url:imageUrl,
            thumbnial:thumbnail_folder+imageUrl,
            carto_image:constants.base_url+imageUrl,
            location:location,reported_date_time:getDate()+" "+getTime()
        }).then(result=>{
            console.log("done");
        res.send({
            'status':200,
            'message':'Successfully send'
        })
        db_sql.sendNotifications("Maintaince","Maintaince uploaded from users","Maintenance",result.id,companyId,"maintaince_details")
    }).catch (err=>{
            console.log(err);
    });
    },
    /*Save Sampling*/
    saveSampling:function(req,originalFileName,res){
        const  sampling = Modulesampling(seq.sequelize,seq.sequelize.Sequelize);
        sampling.create({
            reportedby_user_id:req.body.reportedby_user_id,sample_name:req.body.sample_name,
            phenological_type:req.body.phenological_type,image_url:originalFileName,thumbnail_url:thumbnail_folder+originalFileName,
            sample_type:req.body.sample_type,cluster_per_unit_edit:req.body.cluster_per_unit_edit,
            boxes_per_field:req.body.boxes_per_field,
            kilogram_transport:req.body.kilogram_transport,machinery:req.body.machinery,
            field_type:req.body.field_type
            ,location:req.body.location,reported_datetime:getDate()+" "+getTime(),sample_type_field_id:req.body.sample_type_field_id,
            sample_type_lning:req.body.sample_type_lning,sample_type_strain:req.body.sample_type_strain,sample_type_no_of_breaks:req.body.sample_type_no_of_breaks,
            weight_purning:req.body.weight_purning,drop_buds:req.body.drop_buds,number_of_buds:req.body.number_of_buds,
            number_of_bunches:req.body.number_of_bunches,sample_type_date:req.body.sample_type_date,
            company_id:req.body.company_id
        }).then(result=>{
            console.log("done");
        res.send({
            'status':200,
            'message':'Successfully send'
        })
        db_sql.sendNotifications("Sample","Sample uploaded from users"
            ,"Sample",result.id,req.body.company_id,"sample_field")
    }).catch (err=>{
            console.log(err);
    });
    },
    saveSamplingWithImage:function(req,originalFileName,res){
        const  sampling = Modulesampling(seq.sequelize,seq.sequelize.Sequelize);
        sampling.create({
            reportedby_user_id:req.param('reportedby_user_id', null),company_id:req.param('company_id',null),
            sample_name:req.param('sample_name', null),
            phenological_type:req.param('phenological_type', null),image_url:originalFileName,thumbnail_url:thumbnail_folder+originalFileName,
            sample_type:req.param('sample_type', null),cluster_per_unit_edit:req.param('cluster_per_unit_edit', null),
            boxes_per_field:req.param('boxes_per_field', null),
            kilogram_transport:req.param('kilogram_transport', null),machinery:req.param('machinery', null)
            ,location:req.param('location', null),reported_datetime:getDate()+" "+getTime(),sample_type_field_id:req.param('sample_type_field_id', null),
            sample_type_lning:req.param('sample_type_lning', null),sample_type_strain:req.param('sample_type_strain', null),sample_type_no_of_breaks:req.param('sample_type_no_of_breaks', null),
            weight_purning:req.param('weight_purning', null),drop_buds:req.param('drop_buds', null),number_of_buds:req.param('number_of_buds', null),
            number_of_bunches:req.param('number_of_bunches', null),
            sample_type_date:req.param('sample_type_date', null)
        }).then(result=>{
            console.log("done");
            res.send({
                'status':200,
                'message':'Successfully send'
            })
            db_sql.sendNotifications("Sample","Sample uploaded from users"
                ,"Sample",result.id,req.body.company_id,"sample_field")
        }).catch (err=>{
            console.log(err);
        });
    },
    /*Get Field Listss*/
    fieldlist:function(res,$company_id){
        const fld =  Fields(seq.sequelize,seq.sequelize.Sequelize);
        fld.findAll({
            where:{company_id:$company_id}
        }).then(result=>{
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
    /*Maintainance List*/
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
    /*Disease Lists*/
    diseaseslist:function(res){
        const diseases =  Diseases(seq.sequelize,seq.sequelize.Sequelize);
        diseases.findAll().then(result=>{
            res.send({
            'status':200,
            "data":result
        });
    }).catch (err=>{

        });
    },
    /*get user lists with fild compare*/
    searchUserByField:function(comapny_id,res){
        const users = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        users.findAll({
            where:{company:comapny_id},attributes:
                ['id','email','name','surname'],
        }).then(result=>{
            res.send({
            'status':200,
            "data":result
        });
    }).catch(err=>{
            console.log(err);
    });
    },
    /*
     * Save Tasks
     * */
    addNewTasks:function(req,res){
        const tasks = Moduletasks(seq.sequelize,seq.sequelize.Sequelize);
         console.log(req.body.users_lists);
        tasks.create({
            assign_from_id:req.body.assign_from_id,
            task_id:req.body.task_name,task_details:req.body.task_details
            ,completion_date:req.body.completion_date,
            status:req.body.status,is_enable:req.body.is_enable
        }).then(result=>{

            if(req.body.users_lists!="0")
        {
            saveUsersLists(req.body.users_lists, result.id);
        }
        if(req.body.fields_lists!="0"){
            saveTasksFields(req.body.fields_lists, result.id);
        }
        if(req.body.repeate_date!="0") {
            saveTasksDates(req.body.repeate_date,  result.id);
        }
        res.send({
            'status':200,
            "message":"tasks Successfully saved"
        });

    }).catch(err=>{

        });
    },
    getTasksLists:function(req,res){
        const tasks = Moduletasks(seq.sequelize,seq.sequelize.Sequelize);
        tasks.findAll({where:{"user_id":req.body.user_id,
            "status":req.body.status},
            "is_enable":true}).then(result=>{
            res.send({
            "status":200,
            "data":result
        });
    }).catch(err=>{
            console.log(err);
    });
    },
    getTasksNames:function(req,res,$company_id){
        const tasks = Tasks(seq.sequelize,seq.sequelize.Sequelize);
        tasks.findAll({
            where:{company_id:$company_id}
        }).then(result=>{
            res.send({
            "status":200,
            "data":result
        });
    }).catch(err=>{
            console.log(err);
    });
    }
    ,myUploadTasks:function(req,res){
        const tasks = Moduletasks(seq.sequelize,seq.sequelize.Sequelize);
        tasks.findAll({
            where:{assign_from_id:req.body.user_id}
        }).then(result=>{
            res.send({
            "status":200,
            "data":result,
            "users":getTasksUsers(req.body.user_id)
        });
    }).catch(err=>{
            console.log(err);
    });
    },
    getListsOfDates:function(task_id,res){
        const dates = UserTasksDates(seq.sequelize,seq.sequelize.Sequelize);
        dates.findAll({
            where:{
                task_id:task_id
            }
        }).then(results=>{
            console.log(results);
        res.send({
            "status":200,
            "data":results
        });

        }).catch (err=>{
            console.log(err);
        });
    },
    savetaskLocation:function (req,res) {
        const task_location = TasksLocations(seq.sequelize,seq.sequelize.Sequelize);
        task_location.create({
            app_user_id:req.body.user_id,
            latitude:req.body.latitude,
            longitude:req.body.longitude
        }).then(result=>{
            res.send({
            "status":200,
            "data":result
        });
            console.log(result);
        }).catch(err=>{
            res.send({
            "status":204,
            "data":err
    });
        });
    },
    saveNotifications:function(req,res){
        var time_date =new Date().toISOString().slice(0, 19).replace('T', ' ');
        const notifications = Notifications(seq.sequelize,seq.sequelize.Sequelize);
        notifications.findAll({
            where:{
                "n_type_id":req.body.n_type_id,
                "user_id":req.body.user_id,
                "n_type":req.body.n_type,
            }
        }).then(results=>{
            if(results.length==0){
                notifications.create({
                    n_title:req.body.n_title,n_message:req.body.n_message,
                    n_type:req.body.n_type,n_type_id:req.body.n_type_id,
                    user_id:req.body.user_id,action_screen:req.body.action_screen,
                    status:req.body.status,
                    datetime:time_date
                }).then(result=>{
                    console.log(result.dataValues);
                }).catch(err=>{
                    console.log(err);
                });
            }
        }).catch (err=>{
            console.log(err);
        });
    },getMyNotifications:function(req,res) {
        const notifications = Notifications(seq.sequelize, seq.sequelize.Sequelize);
        notifications.findAll({
            where: {
                user_id: req.body.user_id
            }
        }).then(result=>{
            res.send({
                "status":200,
                "data":result
            })
            console.log(result);
        }).catch(err=>{
            console.log(err);
        });
    },
    checkAppVersion:function(req,res) {
        const appVersion = AppVersion(seq.sequelize, seq.sequelize.Sequelize);
        appVersion.findAll({
            limit:1
        }).then(result=>{
            res.send({
                "status":200,
                "data":result
            })
            console.log(result);
        }).catch(err=>{
            console.log(err);
        });
    }
}
/*Get Current Time*/
function getTime() {
    var time = new Date();
    console.log(time.toLocaleString('en-US', { month: 'long', hour12: true }));
    console.log(time.toLocaleString('en-US', { weekday: 'long', hour12: true }));
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

/*Get Current Date*/
function getDate() {
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d');
    console.log(formatted);
    return formatted;
}
function saveUsersLists(usersdata,task_id){
    const userlists = AssignTasksUsersLists(seq.sequelize,seq.sequelize.Sequelize);
    users = usersdata.split(",");
    console.log(users);
    for(var i=0;i<users.length;i++){
        userlists.create(
            {
                task_id:task_id,
                user_id:users[i],
                status:0
            }
        ).then(result=>{
        }).catch (err=>{
            console.log(err);
    });
    }
    for(var i=0;i<users.length;i++){
        db_sql.sendTaskNotifications("Tarea Asignada", "Congratulation New Task Assigned",
            "TareaAsignada", users[i],task_id,"main_activity");
    }
}

function saveTasksFields(tasksdata,task_id){
    const taskfields = UserTasksFields(seq.sequelize,seq.sequelize.Sequelize);
    tasks = tasksdata.split(",");
    for(var i=0;i<tasks.length;i++){
        taskfields.create({
            task_id:task_id,field_id:tasks[i]}).then(result=>{

        }).catch (err=>{
            console.log(err);
    });
    }

}
function saveTasksDates(tasksDates,task_id){
    const dates = UserTasksDates(seq.sequelize,seq.sequelize.Sequelize);
    d = tasksDates.split(",");
    for(var i=0;i<d.length;i++){
        dates.create({ task_id:task_id,date:d[i]}).then(result=>{

        }).catch (err=>{
            console.log(err);
    });
    }

}
function getTasksUsers(task_id) {
    users=null;
    const userlists = AssignTasksUsersLists(seq.sequelize, seq.sequelize.Sequelize);
    userlists.findAll({
        where:{
            task_id:task_id
        }
    }).then(result=>{
       console.log(result);
});
    return users;
}
