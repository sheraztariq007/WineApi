const  seq = require('../models/index');
var dateTime = require('node-datetime');
var time = new Date();
const  Usuarios = require('../models/usuarios');
const  Moduledisease = require('../models/module_disease');
const  Modulefieldnotebook = require('../models/module_fieldnotebook');
const  Modulemaintain = require('../models/module_maintain');
const  Modulesampling = require('../models/module_sampling');
const  ModuleSamplingComspec = require('../models/module_samplings_comspec_pdc_decalogo.js');
const  Fields = require('../models/field');
const  Labor = require('../models/labor');
const  Maintenance = require('../models/maintenance');
const  Diseases = require('../models/disease');
const  Moduletasks = require('../models/module_task');
const  AssignTasksUsersLists = require('../models/assign_tasks_users_lists');
const  ModuleTasksTrackWorks = require('../models/module_tasks_trackwork');
const  TempTrackWork = require('../models/temp_task_trackwork');
const  ModuleTasksTrackHours = require('../models/module_tasks_trackhours');
const  UserTasksDates = require('../models/user_tasks_date');
const  UserTasksFields = require('../models/user_tasks_fields');
const  TreatmentJoinsField = require('../models/treatment_joins_field');
const  Tasks = require('../models/tasks');
const  user_role = require('../models/user_role');
const  TasksLocations =  require('../models/tasks_locations');
const  Notifications =  require('../models/notifications');
const  TrackHours = require("../models/module_tasks_trackhours");
const  TrackWork = require("../models/module_tasks_trackwork");
const  SamplingComspec = require('../models/module_samplings_comspec_pdc_decalogo');
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
            'password':md5(password)
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
    getDiseaseList:function(userid,disease_type,details,imageUrl,location,companyId,reported_date_time,res){
        const  disease = Moduledisease(seq.sequelize,seq.sequelize.Sequelize);
        disease.create({
            reportedby_user_id:userid,disease_type:disease_type,
            maintenace:details,
            company_id:companyId,
            image_url:imageUrl,
            reported_datetime:reported_date_time,
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
        /* If Form type General*/
        if(req.body.form_type==1){
            var fieldData  = req.body.field_id;
            var fieldsID = fieldData.split(",");
            for(var i=0;i<fieldsID.length;i++){

                field.create({
                    reportedby_user_id:req.body.reportedby_user_id,marchinar_id:req.body.marchinar_id,
                    labore_id:req.body.labore_id,start_date:req.body.start_date,end_date:req.body.end_date,product:req.body.product,
                    app_method:req.body.app_method,surface:req.body.surface,field_id:fieldsID[i],
                    form_type:req.body.form_type,location:req.body.location,
                    reported_date_time:req.body.reported_date_time,company_id:req.body.company_id
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
            }
        }else
        if(req.body.form_type==4){
            var fieldData  = req.body.field_id;
            var fieldsID = fieldData.split(",");
            for(var i=0;i<fieldsID.length;i++) {
                field.create({
                    reportedby_user_id: req.body.reportedby_user_id,
                    subparcela: req.body.subparcela,
                    start_date: req.body.start_date,
                    field_id: fieldsID[i],
                    horasderiego: req.body.horasderiego,
                    dosis: req.body.dosis,
                    observaciones: req.body.observaciones,
                    form_type: req.body.form_type,
                    location: req.body.location,
                    reported_date_time: getDate() + " " + getTime(),
                    company_id: req.body.company_id
                }).then(result=> {
                    res.send({
                        'status': 200,
                        'message': 'Successfully send'
                    })
                    console.log(req.body)
                    db_sql.sendNotifications("Cuaderno", "Notebook uploaded from users"
                        , "Cuaderno", result.id, req.body.company_id, "riego")
                }).catch(err=> {
                    console.log(err);
                });
            }
        }else  if(req.body.form_type==3){
            var fieldData  = req.body.field_id;
            var fieldsID = fieldData.split(",");
            for(var i=0;i<fieldsID.length;i++) {
                field.create({
                    reportedby_user_id: req.body.reportedby_user_id,
                    trabajador: req.body.trabajador,
                    start_date: req.body.start_date,
                    field_id: fieldsID[i],
                    tipodeabonado: req.body.tipodeabonado,
                    product: req.body.product,
                    dosis: req.body.dosis,
                    observaciones: req.body.observaciones,
                    form_type: req.body.form_type,
                    location: req.body.location,
                    reported_date_time: getDate() + " " + getTime(),
                    company_id: req.body.company_id
                }).then(result=> {
                    res.send({
                        'status': 200,
                        'message': 'Successfully send'
                    })
                    console.log(req.body)
                    db_sql.sendNotifications("Cuaderno", "Notebook uploaded from users"
                        , "Cuaderno", result.id, req.body.company_id, "abonado")
                }).catch(err=> {
                    console.log(err);
                });
            }
        }
        else  if(req.body.form_type==2){

            var fieldData  = req.body.field_id;
            var fieldsID = fieldData.split(",");
            for(var i=0;i<fieldsID.length;i++) {
                field.create({
                    reportedby_user_id: req.body.reportedby_user_id, marchinar_id: req.body.marchinar_id,
                    trabajador: req.body.trabajador, start_date: req.body.start_date,
                    tratamiento: req.body.tratamiento, product: req.body.product, dosis: req.body.dosis,
                    observaciones: req.body.observaciones,field_id: fieldsID[i],
                    form_type: req.body.form_type, location: req.body.location,
                    reported_date_time: getDate() + " " + getTime(), company_id: req.body.company_id
                }).then(result=> {
                    //  saveTreatmetoField(req.body.field_id, result.id);
                    res.send(JSON.stringify({
                        'status': 200,
                        'message': 'Successfully send'
                    }))
                    db_sql.sendNotifications("Cuaderno", "Notebook uploaded from users"
                        , "Cuaderno", result.id, req.body.company_id, "treatmento22")
                }).catch(err=> {
                    console.log(err);
                });

            }
        }
        else  if(req.body.form_type==22){
            field.create({
                reportedby_user_id:req.body.reportedby_user_id,marchinar_id:req.body.marchinar_id,
                trabajador:req.body.trabajador,start_date:req.body.start_date,field_id:req.body.field_id,
                tratamiento:req.body.tratamiento,product:req.body.product,dosis:req.body.dosis,
                observaciones:req.body.observaciones,
                form_type:req.body.form_type,location:req.body.location,
                reported_date_time:getDate()+" "+getTime(),company_id:req.body.company_id
            }).then(result=>{
                res.send({
                    'status':200,
                    'message':'Successfully send'
                })
                console.log(req.body)
                db_sql.sendNotifications("Cuaderno","Notebook uploaded from users"
                    ,"Cuaderno",result.id,req.body.company_id,"treatmento")
            }).catch(err=>{
                console.log(err);
            });
        }

    },
    /*Save All Maintaince Request */

    saveMaintaince:function(userid,maintane_type,details,imageUrl,location,
                            companyId,reported_date_time,res){
        const  maintain = Modulemaintain(seq.sequelize,seq.sequelize.Sequelize);
        maintain.create({
            reportedby_user_id:userid,maintane_type:maintane_type,
            details:details,
            company_id:companyId,
            image_url:imageUrl,
            reported_date_time:reported_date_time,
            thumbnial:thumbnail_folder+imageUrl,
            carto_image:constants.base_url+imageUrl,
            location:location,reported_date_time:getDate()+" "+getTime()
        }).then(result=>{
            console.log("done");
            res.send({
                'status':200,
                'message':'Successfully send'
            })
            db_sql.sendNotifications("Maintenance","Maintaince uploaded from users","Maintenance",result.id,companyId,"maintaince_details")
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
        const samplingComspec =  ModuleSamplingComspec(seq.sequelize,seq.sequelize.Sequelize);

        var date = req.param('reported_date_time',null);
        var sampleType = req.param('sample_type', null);
        var location = req.param('location',null);

        if(req.headers.app_version==undefined && sampleType==5){
            //   if (req.headers.app_version <= 308) {
            location = req.param("ubicacion",null);
            // }
        }

        if(req.headers.app_version==undefined && sampleType==6) {
            //   if (req.headers.app_version == 308) {
            var date = date.split(" ");
            var date = date[0].split("-").reverse().join("-") + " " + date[1] + " " + date[2];
            // }
        }
        sampling.create({
            reportedby_user_id:req.param('reportedby_user_id', null),company_id:req.param('company_id',null),
            sample_name:req.param('sample_name', null),
            phenological_type:req.param('phenological_type', null),image_url:originalFileName,thumbnail_url:thumbnail_folder+originalFileName,
            sample_type:req.param('sample_type', null),cluster_per_unit_edit:req.param('cluster_per_unit_edit', null),
            boxes_per_field:req.param('boxes_per_field', null),
            kilogram_transport:req.param('kilogram_transport', null),machinery:req.param('machinery', null)
            ,location:location,reported_datetime:date,sample_type_field_id:req.param('sample_type_field_id', null),
            sample_type_lning:req.param('sample_type_lning', 0),sample_type_strain:req.param('sample_type_strain', null),sample_type_no_of_breaks:req.param('sample_type_no_of_breaks', null),
            weight_purning:req.param('weight_purning', null),drop_buds:req.param('drop_buds', null),number_of_buds:req.param('number_of_buds', null),
            number_of_bunches:req.param('number_of_bunches', null),
            cepa:req.param('cepa', null), vuelta:req.param('vuelta', null), n_muestreo:req.param('n_mestro', null),
            sample_type_date:req.param('sample_type_date', null),valor_scholander:req.param("valor_scholander",null),
            ubicacion:req.param('ubicacion',null),hora:req.param('hora',null),temparature:req.param('temparature',null),
            humedad_ambiental:req.param('humedad_ambiental',null),observation:req.param('observation',null)

        }).then(result=>{
            console.log("done");
            if(req.body.extras==1) {
                samplingComspec.create({
                    sample_type: result.id,
                    oidio_p: req.param('oidio_p',null),
                    oidio_r: req.param('oidio_r',null),
                    mildium_h: req.param('mildium_h',null),
                    mildium_r: req.param('mildium_r',null),
                    botrytis: req.param('botrytis',null),
                    excoriosis: req.param('excoriosis',null),
                    acariosis: req.param('acariosis',null),
                    erinosis: req.param('erinosis',null),
                    polilla_del_racimo: req.param('polilla_del_racimo',null),
                    altica: req.param('altica',null),
                    yesca: req.param('yesca',null),
                    pajaros: req.param('pajaros',null),
                    helada: req.param('helada',null),
                    granizo: req.param('granizo',null),
                    corrimiento: req.param('corrimiento',null),
                    uvas_pasas: req.param('uvas_pasas',null),
                    carencias: req.param('carencias',null),
                    malas_hierbas: req.param('malas_hierbas',null),
                    otros: req.param('otros',null),
                    racimo_numero:req.param('racimo_numero',null),
                    racimo_tamano: req.param('racimo_tamano',null),
                    racimo_tipo: req.param('racimo_tipo',null),
                    racimo_peso: req.param('racimo_peso',null),
                    min: req.param('min',null),
                    max: req.param('max',null),
                    envero: req.param('envero',null),
                }).then(result=>{}).catch(er=>{
                    console.log(er);
                });
            }
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
            where:{company_id:$company_id},
            order: [['name','ASC']]
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
    getTasksNames:function(req,res,company_id){
        const tasks = Tasks(seq.sequelize,seq.sequelize.Sequelize);
        tasks.findAll({
            where:{company_id:company_id},
            order: [['id','ASC']]
        }).then(result=>{

            res.send({
                "status":200,
                "data":result
            });

        }).catch(err=>{
            console.log(err);
        });
    },
    getTasksNamesWeb:function(req,res){
        const tasks = Tasks(seq.sequelize,seq.sequelize.Sequelize);
        tasks.findAll({
            order: [['id','ASC']]
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
            console.log("Notification Lists>>>>>>>>>>")
            console.log(results);
            if(results.length==0){
                notifications.create({
                    n_title:req.body.n_title,n_message:req.body.n_message,
                    n_type:req.body.n_type,n_type_id:req.body.n_type_id,
                    user_id:req.body.user_id,action_screen:req.body.action_screen,
                    status:req.body.status,
                    datetime:time_date
                }).then(result=>{
                    console.log("Notification Success >>>>>>>>>>")
                    console.log(result.dataValues);
                }).catch(err=>{
                    console.log("Notification Fail >>>>>>>>>>")
                    console.log(err);
                });
            }
        }).catch (err=>{
            console.log("Notification Fail >>>>>>>>>>")
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
    },getTasksNamesNewApi:function(req,res,company_id){
        const tasks = Tasks(seq.sequelize,seq.sequelize.Sequelize);
        tasks.findAll({
            where:{company_id:company_id},
            order: [['id','ASC']]
        }).then(result=>{

            tasks.findOne({
                where:{id:1}
            }).then(s_result=>{
                res.send({
                    "status":200,
                    "data":result,
                    "public":s_result
                });
            }).catch(err2=>{
                console.log(err2);
            });



        }).catch(err=>{
            console.log(err);
        });
    },assignTreatment:function(req,res){
        const  field = Modulefieldnotebook(seq.sequelize,seq.sequelize.Sequelize);
        field.create({
            reportedby_user_id: req.body.reportedby_user_id, marchinar_id: req.body.marchinar_id,
            trabajador: req.body.trabajador, start_date: req.body.start_date,
            tratamiento: req.body.tratamiento, product: req.body.product, dosis: req.body.dosis,
            observaciones: req.body.observaciones,
            form_type: req.body.form_type,module_diseases_id:req.body.module_diseases_id,
            location: req.body.location,
            reported_date_time: getDate() + " " + getTime(), company_id: req.body.company_id
        }).then(result=> {
            saveTreatmetoField(req.body.field_id,result.id);
            res.send({
                'status': 200,
                'message': 'Successfully send'
            })
            console.log(req.body)
            db_sql.sendNotifications("Cuaderno", "Notebook uploaded from users"
                , "Cuaderno", result.id, req.body.company_id, "treatmento22")
        }).catch(err=> {
            console.log(err);
        });
    },trackUserWork:function(req,res){
        const  trackWork = ModuleTasksTrackWorks(seq.sequelize,seq.sequelize.Sequelize);
        const  trackHours = ModuleTasksTrackHours(seq.sequelize,seq.sequelize.Sequelize);
        const  tempWork = TempTrackWork(seq.sequelize,seq.sequelize.Sequelize);
        /*Save and Track Work time*/

        trackWork.findOne({
            where:{ user_id:req.body.user_id,
                company_id:req.body.company_id,
                work_time:req.body.work_time,
                token:req.body.token,
                status:req.body.status,
                work_date:req.body.work_date}
        }).then(result1=>{
            if(result1==null){

                // check   request Status

                if(req.body.status==0){

                    // Delete old  temp record
                    tempWork.destroy({
                        where:{user_id:req.body.user_id,}
                    }).catch(err=>{
                        console.log(err);
                    });

                    // save   reord  in temp  Table

                    tempWork.create({
                        user_id:req.body.user_id,
                        company_id:req.body.company_id,
                        work_time:req.body.work_time,
                        token:req.body.token,
                        status:req.body.status,
                        work_date:req.body.work_date
                    }).catch(err=>{
                        console.log(err);
                    })
                }

                // save record in main  table

                trackWork.create({
                    user_id:req.body.user_id,
                    company_id:req.body.company_id,
                    work_time:req.body.work_time,
                    token:req.body.token,
                    status:req.body.status,
                    work_date:req.body.work_date
                }).then(result=>{
                    console.log(result);
                }).catch(err=>{
                    console.log(err);
                });
                if(req.body.status==1){

                    tempWork.destroy({
                        where:{user_id:req.body.user_id,}
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            }
        }).catch(err=>{

        });

        /*Track Hours Add and Update In hours*/
        //  if(req.body.status==1) {

        trackHours.findOne({
            where: {
                user_id: req.body.user_id,
                company_id: req.body.company_id,
                date: req.body.work_date,
            }
        }).then(result=> {

            if (result != null) {
                /*
                 trackHours.update({
                 total_hours: seq.sequelize.literal("total_hours + '"+req.body.total_hours+"' ")
                 },
                 {
                 where: {
                 user_id: req.body.user_id,
                 date: req.body.work_date
                 }
                 }).then(result=> {
                 res.send({
                 "response":"History Saved"
                 });
                 }).catch(err=> {
                 console.log(err);
                 });*/
            }
            else {
                trackHours.create({
                    user_id: req.body.user_id,
                    company_id: req.body.company_id,
                    total_hours: req.body.total_hours,
                    date: req.body.work_date,
                }).then(result=> {
                    console.log(result);
                }).catch(err=> {
                    console.log(err);
                });
            }
        }).catch(err=> {
            console.log(err);
        })
        //  }
    },getWorks:function(req,res){
        const users = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        const works = TrackWork(seq.sequelize,seq.sequelize.Sequelize);
        const hours = TrackHours(seq.sequelize,seq.sequelize.Sequelize);

        users.hasMany(hours, {foreignKey: 'user_id', sourceKey: 'id',as:'date'});
        hours.hasMany(works, {foreignKey: 'work_date', sourceKey: 'date',as:'timeline'});
        users.findAll({
            attributes: ['id','company',"name","surname","email"],
            where:{
              company:req.body.company_id
            },
            include: [{
                model:hours,
                attributes: ["date"],
                as:'date',
                include:[{
                    model: works,
                    as:"timeline"
                }]
            }],
            order: [
                [
                    {model: hours, as: 'date'},
                    'date',"DESC",
                ],
                [
                    {model: hours, as: 'date'},
                    {model: works, as: 'timeline'},
                    'token', "DESC"
                ]
            ]

        }).then(result=>{
            if(result.length>0){
                res.send({
                    "status":200,
                    "data":result
                });
            }else{
                res.send({
                    "status":204,
                    "message":"No result found",
                });
            }
        }).catch(err=>{
            console.log(err);
        });

    },getTempTime(req,res){
        tempTime =  TempTrackWork(seq.sequelize,seq.sequelize.Sequelize);
        tempTime.findAll({
            where:{user_id:req.body.user_id}
        }).then(result=>{
            res.send({
                "status":200,
                "data":result
            });
        }).catch(err=>{
            console.log(err);
        });
    },getSamplingListUpdated:function(req,res){
        let User = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        let SampleComspec = SamplingComspec(seq.sequelize,seq.sequelize.Sequelize)
        let Field = Fields(seq.sequelize,seq.sequelize.Sequelize)
        let Sampling = Modulesampling(seq.sequelize,seq.sequelize.Sequelize)
        Sampling.hasOne(SampleComspec, {foreignKey: 'sample_type', sourceKey: 'id',as: 'SampleComspec'});
        Sampling.hasOne(User, {foreignKey: 'id', sourceKey: 'reportedby_user_id', as: 'User'});
        Sampling.hasOne(Field, {foreignKey: 'id', sourceKey: 'sample_type_field_id', as: 'Field'});

        Sampling.findAll({

            where:{
                company_id:req.body.company_id,
            },
            include: [
                {
                    model:User,
                    attributes:["name","surname","email"],
                    as:'User'
                },
                {
                    model:Field,
                    attributes:["name"],
                    as:'Field'
                },
                {
                    model:SampleComspec,
                    as:'SampleComspec'
                }
            ],
        }).then(result=>{
            if(result.length>0){
                res.send({
                    "status":200,
                    "sampling":result
                });
            }else{
                res.send({
                    "status":204,
                    "message":"No result found",
                });
            }
        }).catch(err=>{
            console.log(err);
        });
    },searchSamplingByFieldUpdated:function (req,res) {
        let User = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        let SampleComspec = SamplingComspec(seq.sequelize,seq.sequelize.Sequelize)
        let Field = Fields(seq.sequelize,seq.sequelize.Sequelize)
        let Sampling = Modulesampling(seq.sequelize,seq.sequelize.Sequelize)
        Sampling.hasOne(SampleComspec, {foreignKey: 'sample_type', sourceKey: 'id',as: 'SampleComspec'});
        Sampling.hasOne(User, {foreignKey: 'id', sourceKey: 'reportedby_user_id', as: 'User'});
        Sampling.hasOne(Field, {foreignKey: 'id', sourceKey: 'sample_type_field_id', as: 'Field'});

        Sampling.findAll({

            where:{
                company_id:req.body.company_id,
                sample_type:req.body.sample_type,
                sample_type_field_id:req.body.field_id
            },
            include: [
                {
                    model:User,
                    attributes:["name","surname","email"],
                    as:'User'
                },
                {
                    model:Field,
                    attributes:["name"],
                    as:'Field'
                },
                {
                    model:SampleComspec,
                    as:'SampleComspec'
                }
            ],

        }).then(result=>{
            if(result.length>0){
                res.send({
                    "status":200,
                    "sampling":result
                });
            }else{
                res.send({
                    "status":204,
                    "message":"No result found",
                });
            }
        }).catch(err=>{
            console.log(err);
        });

    },searchSamplingByAllFieldsUpdate:function (req,res) {
        let Sample = Modulesampling(seq.sequelize,seq.sequelize.Sequelize);
        let User = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
        let SampleComspec = SamplingComspec(seq.sequelize,seq.sequelize.Sequelize);
        let Field = Fields(seq.sequelize,seq.sequelize.Sequelize)

        Sample.hasOne(SampleComspec, {foreignKey: 'sample_type', sourceKey: 'id',as: 'SampleComspec'});
        Sample.hasOne(User, {foreignKey: 'id', sourceKey: 'reportedby_user_id', as: 'User'});
        Sample.hasOne(Field, {foreignKey: 'id', sourceKey: 'sample_type_field_id', as: 'Field'});

        const Op = seq.Sequelize.Op;

        Sample.findAll({
            where:{
                [Op.and]:[
                    {
                        company_id:req.body.company_id,
                        sample_type_field_id:req.body.field_id,
                        sample_type:req.body.sample_type,

                    },
                    seq.sequelize.Sequelize.where(
                        seq.sequelize.Sequelize.fn(
                            'substring',
                            seq.sequelize.Sequelize.col('reported_datetime'),
                            0,11

                        ),
                        '>=',
                        req.body.start_date
                    ),
                    seq.sequelize.Sequelize.where(
                        seq.sequelize.Sequelize.fn(
                            'substring',
                            seq.sequelize.Sequelize.col('reported_datetime'),
                            0,11

                        ),
                        '<=',
                        req.body.end_date
                    )
                ]

            },
            include: [
                {
                    model:User,
                    attributes:["name","surname","email"],
                    as:'User'
                },
                {
                    model:Field,
                    attributes:["name"],
                    as:'Field'
                },
                {
                    model:SampleComspec,
                    as:'SampleComspec'
                }
            ],

        }).then(result=>{
            if(result.length>0){
                res.send({
                    "status":200,
                    "sampling":result
                });
            }else{
                res.send({
                    "status":204,
                    "message":"No result found",
                });
            }
        }).catch(err=>{
            console.log(err);
        });

    }


    /*,
     saveOfflineWorking:function (req,res) {
     const  trackWork = ModuleTasksTrackWorks(seq.sequelize,seq.sequelize.Sequelize);
     const  trackHours = ModuleTasksTrackHours(seq.sequelize,seq.sequelize.Sequelize);
     var workarray = req.body.record;
     var data  =  JSON.parse(workarray);

     var hours_data  =  data.hoursarray;
     // console.log(hours_data);

     var list = data.workarray;

     for(var i=0;i<list.length;i++){
     single = JSON.parse(list[i]);
     check = db_sql.searchWork(single.userId,single.companyId,
     single.workTime,single.workDate,single.status);
     if(check!=null && check.rowcount==0) {
     trackWork.create({
     user_id: single.userId,
     company_id: single.companyId,
     work_time: single.workTime,
     status: single.status,
     work_date: single.workDate
     }).then(result=> {
     }).catch(err=> {
     //console.log(err);
     });
     }
     }

     for(var i =0;i<hours_data.length;i++){
     single = JSON.parse(hours_data[i]);
     check =  db_sql.searchHours(single.userId,single.companyId,
     single.date,single.totalhours);
     if(check==false){
     console.log("Found.....");
     trackHours.create({
     user_id: single.userId,
     company_id: single.companyId,
     total_hours: single.totalhours,
     date: single.date,
     }).then(result=> {
     console.log(result);
     }).catch(err=> {
     console.log(err);
     });
     }
     }
     }*/
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

function saveTreatmetoField(fieldData,treatmentId){
    //console.log(fieldData+"===================================");
    const reatmentJoinsField = TreatmentJoinsField(seq.sequelize,seq.sequelize.Sequelize);
    var fieldsID = fieldData.split(",");
    for(var i=0;i<fieldsID.length;i++){
        reatmentJoinsField.create({
            treatment_id:treatmentId,
            field_id:fieldsID[i]
        }).then(result=>{

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
