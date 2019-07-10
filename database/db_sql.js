const {pool,Client} = require("pg");
var md5 = require("md5")
var dateTime = require('node-datetime');
var time = new Date();
const  constants = require('../config/constants.json')
var FCM = require('fcm-node');
var serverKey = constants.server_key; //put your server key here
var fcm = new FCM(serverKey);
var data = [];
var crypto = require('crypto');

const client = new Client({
    connectionString:constants.database_url
});
client.connect();
module.exports = {
    AssignTasks:function(user_id,res1){
        client.query("select  module_tasks.id ,tasks.name as task_name,module_tasks.target_date as deadline , " +
            "task_details,assign_from_id,assign_tasks_users_lists.status as status,assign_tasks_users_lists.user_id, u.email" +
            " from module_tasks ,assign_tasks_users_lists, tasks, usuarios as u where assign_from_id='"+user_id+"'" +
            " AND  module_tasks.id=assign_tasks_users_lists.task_id AND module_tasks.task_id=tasks.id AND " +
            "assign_tasks_users_lists.user_id=u.id  ORDER BY tasks.name  " ,(err,res)=>{
            console.log(err,res);
            res1.send({"status":200,
                "data":res.rows})
        });
    },
    loginUser:function(email,password,res){
        //,include: [{model:role, as: 'role'}]
        // client.query("select *from usuarios",(err,res1)=>{
        //     console.log(err,res1);
        // });
        client.query("select usuarios.id,usuarios.email,usuarios.role_id,usuarios.company," +
            "usuarios.password,usuarios.name,usuarios.surname,usuarios.group," +
            "usuarios.phone,usuarios.last_login_date," +
            "usuarios.account_disabled,usuarios.module_task,usuarios.module_diseases," +
            "usuarios.module_maintenance,usuarios.module_gathering," +
            "user_roles.role_name," +
            "COALESCE(comp.module_disease,false) as comp_disease, " +
            "COALESCE(comp.module_mantain,false) as comp_mantain," +
            "COALESCE(comp.module_sampling,false) as comp_sampling," +
            "COALESCE(comp.module_notefield,false) as comp_notefield," +
            "COALESCE(comp.module_tasks,false) as comp_tasks, COALESCE(comp.name,'') as company_name," +
            " COALESCE(comp.mainscreen_image,'') as main_image, COALESCE(comp.splash_image,'') as splash_image," +
            "COALESCE(comp.contactmail,'') as contactmail,COALESCE(splash_color,'') as splash_colors," +
            " COALESCE(comp.contactphone,'') as contactphone  "  +
            "from usuarios,user_roles,companies as comp where" +
            " usuarios.email='"+email+"' AND usuarios.password='"+md5(password)+"' AND usuarios.role_id=user_roles.id " +
            "AND usuarios.company=comp.id LIMIT 1",(err,resp)=>{
            console.log(err,resp);
            if(resp.rows.length>0) {
                res.send({"status":200,
                    "data": resp.rows})
            }else{
                res.send({"status":204,
                    "message": "sorry user not found"})
            }
        });
    },
    newTasks:function(user_id,res1){
        client.query("select  module_tasks.id,tasks.name as task_name,task_details,assign_from_id,assign_tasks_users_lists.status as status ,module_tasks.createdat from  assign_tasks_users_lists,module_tasks, tasks " +
            "where  assign_tasks_users_lists.task_id=module_tasks.id " +
            "AND module_tasks.task_id=tasks.id " +
            " AND assign_tasks_users_lists.user_id='"+user_id+"' order by tasks.name " ,(err,res)=>{
            console.log(err,res);
            res1.send({"status":200,"data":res.rows})
        });
    },
    taskWithFields:function(task_id,res1){
        client.query("Select name from fields, " +
            "user_tasks_fields where fields.id=user_tasks_fields.field_id" +
            " AND user_tasks_fields.task_id='"+task_id+"'" ,(err,res)=>{
            //console.log(err,res);
            res1.send({"status":200,"data":res.rows})
        });
    },
    updatTaskStatus:function(task_id,user_id,status,company_id,resp){
        if(status==1){
            checkAlreadyTaskRunning(task_id,user_id,status,company_id,resp);
        }else{
            endTask(task_id,user_id,status,company_id,resp);
        }

    },
    deletetasks:function(task_id,manager_id,user_id,resp){
        client.query("delete from assign_tasks_users_lists where task_id='"+task_id+"'" +
            " AND user_id ='"+user_id+"' ",
            (err,res)=>{
                console.log(err,res);
                if(res.rowCount>0){
                    resp.send({
                        "status":200,
                        "message":"Task Successfully deleted"
                    });
                    client.query("select id  from module_tasks where id=(select task_id from assign_tasks_users_lists where task_id='"+task_id+"'  LIMIT 1)"
                        ,(err,resc)=>
                        {
                            console.log(err,resc);
                            if(resc.rowCount==0){
                                client.query("delete from module_tasks where id='"+task_id+"'",(err,resd)=>{
                                    console.log(err,resd);
                                });
                            }

                        });
                }else{
                    resp.send({
                        "status":204,
                        "message":"Sorry Status not Delete"
                    });
                }
            });
    },
    checkRunningTasks:function(user_id,resp) {
        client.query("select tasks.id as task_id, tasks.name as name  from  module_tasks,assign_tasks_users_lists,tasks where " +
            "assign_tasks_users_lists.user_id='"+user_id+"' AND assign_tasks_users_lists.status = 1 AND " +
            "module_tasks.id=assign_tasks_users_lists.task_id AND " +
            "tasks.id=module_tasks.task_id ", (err, response) => {
            console.log(err,response);
            if (response.rowCount > 0) {
                resp.send({
                    "status": 200,
                    "data":response.rows,
                    "message": "Please first finish your old job."
                });
            }else{
                resp.send({
                    "status": 204,
                    "message": "No One Task is Running"
                });
            }
        });
    },
    createLocationTable:function(){
        client.query("create table " +
            " if not exists module_tasks_locations (" +
            "app_user_id integer," +
            "company_id integer,"+
            "task_id integer,"+
            "latitude text,"+
            "longitude text,"+
            "location geometry," +
            "datetime timestamp " +
            ")",(err,res)=>{
            console.log(err,res);
        });
    },
    savegeometrylocation:function(req){
        var time_date =new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(time_date);
        client.query("insert into module_tasks_locations" +
            "(company_id,app_user_id,task_id,latitude,longitude,location,datetime) " +
            "values('"+req.body.company_id+"','"+req.body.user_id+"',"+req.body.task_id+", " +
            " '"+req.body.latitude+"','"+req.body.longitude+"' " +
            ",ST_GeomFromText('POINT("+req.body.longitude+" "+req.body.latitude+")'), '"+time_date+"' )"
            ,(err,resp)=>{
                console.log(err,resp);
            });
    },

    getUsersLocations:function(req,res){
        var newDateObj = new Date();
        var time_date1 =new Date(newDateObj.getTime()).toISOString().slice(0, 19).replace('T', ' ');
        var time_date =new Date(newDateObj.getTime()-(1440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select  DISTINCT mtask.app_user_id, '"+time_date1+"'-mtask.datetime as current," +
            "mtask.latitude as latitude , mtask.longitude as longitude, " +
            "usuarios.name as user_name,tasks.name as task_name " +
            ", mtask.datetime as datetime from module_tasks_locations as" +
            " mtask, usuarios, tasks" +
            " where mtask.app_user_id IN" +
            " ("+req.body.users_id+")  AND  mtask.datetime >='"+time_date+"'  AND mtask.task_id="+req.body.task_id+"  AND " +
            " mtask.app_user_id=usuarios.id AND tasks.id=mtask.task_id " +
            " ORDER BY mtask.app_user_id   ",
            (err,resp)=>{
                console.log(err,resp);
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            });
    },
    getSingleUserLocation:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(1440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');

        client.query("SELECT *" +
            "FROM public.module_tasks_locations  where app_user_id="+req.body.user_id+" AND task_id="+req.body.task_id+" AND" +
            " datetime > '"+time_date+"' ", (err,resp)=>{
            console.log(err,resp);
            res.send({
                "status":200,
                "data":resp.rows
            });
        });
    },
    getMultiUserLocation:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(1440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("SELECT *" +
            "FROM public.module_tasks_locations" +
            "  where app_user_id  IN (" + req.body.user_id+") AND task_id=" + req.body.task_id + " AND" +
            " datetime > '" + time_date + "'", (err, resp)=> {
            //console.log(err, resp);
            if(resp.rowCount>0) {
                data = resp.rows
            }
            client.query("SELECT DISTINCT(app_user_id) , count(app_user_id) as rows " +
                "FROM  module_tasks_locations" +
                "  where app_user_id  IN (" + req.body.user_id+") AND task_id=" + req.body.task_id + " AND" +
                " datetime > '" + time_date + "'  group by app_user_id ", (err, resp1)=> {
                console.log(err, resp1);
                res.send({
                    "status": 200,
                    "data": data,
                    "rowcount":resp1.rows
                });

            });

        });

    },
    savetoken:function(req,res){
        console.log(req.body.user_id+" "+req.body.token);
        client.query("SELECT *from fcm_tokens where user_id='"+req.body.user_id+"'",(err,resp)=>{
            if(resp.rowCount>0){
                client.query("update fcm_tokens set token='"+req.body.token+"' where user_id="+req.body.user_id+" ", (err,res1)=>{
                    console.log(err,res1);
                });
            }else{
                client.query("insert into fcm_tokens(user_id,token) values('"+req.body.user_id+"','"+req.body.token+"') ", (err,res2)=>{
                    console.log(err,res2);
                });
            }
        });
    },
    sendNotifications:function (title,message,type,id,company_id,screen_name) {
        client.query("select  fcm_tokens.token from usuarios,fcm_tokens where company='"+company_id+"' AND " +
            "role_id=2 AND usuarios.id=fcm_tokens.user_id",(err,res)=>{
            console.log(err,res);
            if(res.rowCount>0) {
                for (var i = 0; i < res.rowCount; i++) {
                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        to: res.rows[i].token,

                        notification: {
                            click_action: screen_name,
                            title: title,
                            body: type+ " Uplaoded From Users"
                        },
                        data: {  //you can send only notification or only data(or include both)
                            type: type,
                            id: id
                        }
                    };
                    fcm.send(message, function (err, response) {
                        if (err) {
                            console.log("Something has gone wrong!");
                        } else {
                            console.log("Successfully sent with response: ", response);
                        }
                    });
                }
            }
        });
    },
    detailDiseaseById:function(req,res){
        client.query("SELECT  usuarios.name as name, usuarios.surname as  lastname, usuarios.email as email, module_diseases.id as disease_id," +
            " diseases.name as diseases_name,module_diseases.image_url as image_url, module_diseases.thumbnial as thumbnial," +
            " module_diseases.reported_datetime as reported_datetime," +
            " module_diseases.maintenace as details, module_diseases.location as location " +
            " from module_diseases,diseases,usuarios where module_diseases.id='"+req.body.id+"' AND" +
            " module_diseases.disease_type=diseases.id AND module_diseases.reportedby_user_id = usuarios.id",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Some thing Wrong!"
                });
            }
        });
    },maintainDiseaseById:function(req,res){
        client.query("SELECT  usuarios.name as name, usuarios.surname as  lastname, usuarios.email as email, module_maintains.id as maintain_id," +
            " maintenances.name as maintenances_name,module_maintains.image_url as image_url, module_maintains.thumbnial as thumbnial," +
            " module_maintains.reported_date_time as reported_datetime," +
            " module_maintains.details as details, module_maintains.location as location " +
            " from module_maintains,maintenances,usuarios where module_maintains.id='"+req.body.id+"' AND" +
            " module_maintains.maintane_type=maintenances.id AND module_maintains.reportedby_user_id = usuarios.id",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Some thing Wrong!"
                });
            }
        });
    },notebookDetailsById:function(req,res){
        client.query("Select usuarios.name as  name,usuarios.surname as  lastname, usuarios.email as email,  module_fieldnotebooks.marchinar_id as marchinar_id,maquinaria.name as maquinaria_name," +
            " module_fieldnotebooks.start_date as start_date, module_fieldnotebooks.end_date as end_date," +
            "module_fieldnotebooks.product as product," +
            " module_fieldnotebooks.app_method as app_method, module_fieldnotebooks.surface as surface," +
            "module_fieldnotebooks.location as location, " +
            "module_fieldnotebooks.reported_date_time  as reported_date_time, fields.name as field_name, " +
            "labors.name as labors_name" +
            " from usuarios,labors,fields,module_fieldnotebooks,maquinaria where " +
            " module_fieldnotebooks.id='"+req.body.id+"' " +
            "AND module_fieldnotebooks.reportedby_user_id=usuarios.id AND " +
            " module_fieldnotebooks.labore_id=labors.id AND  " +
            "module_fieldnotebooks.field_id=fields.id AND " +
            " maquinaria.id=module_fieldnotebooks.marchinar_id",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Some thing Wrong!"
                });
            }
        });
    },RiegoDetailsById:function(req,res){
        client.query("Select usuarios.name as  name,usuarios.surname as  lastname, usuarios.email as email, module_fieldnotebooks.subparcela as subparcela ," +
            " module_fieldnotebooks.start_date as start_date, module_fieldnotebooks.horasderiego as horasderiego," +
            "module_fieldnotebooks.dosis as dosis," +
            " module_fieldnotebooks.observaciones as observaciones," +
            "module_fieldnotebooks.location as location, " +
            "module_fieldnotebooks.reported_date_time  as reported_date_time, fields.name as field_name " +
            " from usuarios,fields,module_fieldnotebooks where " +
            " module_fieldnotebooks.id='"+req.body.id+"' " +
            "AND module_fieldnotebooks.reportedby_user_id=usuarios.id AND " +
            "module_fieldnotebooks.field_id=fields.id ",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Some thing Wrong!"
                });
            }
        });
    },
    AbonadoDetailsById:function(req,res){
        client.query("Select usuarios.name as  name,usuarios.surname as  lastname, usuarios.email as email, module_fieldnotebooks.trabajador as trabajador ," +
            " module_fieldnotebooks.start_date as start_date, module_fieldnotebooks.tipodeabonado as tipodeabonado," +
            "module_fieldnotebooks.dosis as dosis,module_fieldnotebooks.product as product," +
            " module_fieldnotebooks.observaciones as observaciones," +
            "module_fieldnotebooks.location as location, " +
            "module_fieldnotebooks.reported_date_time  as reported_date_time, fields.name as field_name " +
            " from usuarios,fields,module_fieldnotebooks where " +
            " module_fieldnotebooks.id='"+req.body.id+"' " +
            "AND module_fieldnotebooks.reportedby_user_id=usuarios.id AND " +
            "module_fieldnotebooks.field_id=fields.id ",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Some thing Wrong!"
                });
            }
        });
    },
    treatmentoDetailsById:function(req,res){
        client.query("Select usuarios.name as  name,usuarios.surname as  lastname, usuarios.email as email, module_fieldnotebooks.trabajador as trabajador,maquinaria.name as maquinaria_name," +
            "module_fieldnotebooks.marchinar_id as marchinar_id," +
            " module_fieldnotebooks.start_date as start_date, module_fieldnotebooks.tratamiento as tratamiento," +
            "module_fieldnotebooks.dosis as dosis,module_fieldnotebooks.product as product," +
            " module_fieldnotebooks.observaciones as observaciones," +
            "module_fieldnotebooks.location as location, " +
            "module_fieldnotebooks.reported_date_time  as reported_date_time, fields.name as field_name " +
            " from usuarios,fields,module_fieldnotebooks,maquinaria where " +
            " module_fieldnotebooks.id='"+req.body.id+"' " +
            "AND module_fieldnotebooks.reportedby_user_id=usuarios.id AND " +
            "module_fieldnotebooks.field_id=fields.id AND " +
            " maquinaria.id=module_fieldnotebooks.marchinar_id ",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Some thing Wrong!"
                });
            }
        });
    },
    samplingDetailById:function(req,res){
        client.query("SELECT  usuarios.name as  name,usuarios.surname as  lastname, usuarios.email as email, " +
            "m_s.sample_type_field_id as sample_type_field_name,fields.name as field_name ,m_s.phenological_type as phenological_type, " +
            "m_s.thumbnail_url as thumbnail_url,m_s.image_url as image_url, m_s.field_type as field_type_name" +
            ",m_s.sample_name as sample_name, m_s.sample_type as sample_type, m_s.cluster_per_unit_edit," +
            "m_s.boxes_per_field, m_s.kilogram_transport, m_s.machinery, " +
            "m_s.location,m_s.sample_type_date,m_s.sample_type_lning,m_s.sample_type_strain," +
            "m_s.sample_type_no_of_breaks, m_s.weight_purning,m_s.drop_buds,m_s.number_of_buds,m_s.cepa," +
            "m_s.valor_scholander,m_s.ubicacion,m_s.hora,m_s.temparature," +
            "m_s.humedad_ambiental,m_s.observation," +
            "m_s.number_of_bunches, m_s.reported_datetime from module_samplings as m_s, fields,usuarios  " +
            " where m_s.id = '"+req.body.id+"' AND  m_s.sample_type_field_id=fields.id AND m_s.reportedby_user_id=usuarios.id",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Some thing Wrong!"
                });
            }
        });
    },saveNotifications:function(req,res){
        client.query("INSERT INTO notifications(n_title,n_message,n_type,n_type_id,user_id,action_screen,status) " +
            "values('"+req.body.n_title+"','"+req.body.m_message+"','"+req.body.n_type+"','"+req.body.n_type_id+"'," +
            "'"+req.body.user_id+"','"+req.body.action_screen+"',0)",(err,resp)=>{
        });
    },
    sendTaskNotifications:function (title,message,type,user_id,task_id,screen_name) {
        client.query("select  fcm_tokens.token from usuarios,fcm_tokens where " +
            " usuarios.id='"+user_id+"' AND usuarios.id=fcm_tokens.user_id",(err,res)=>{
            console.log(err,res);
            if(res.rowCount>0) {
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: res.rows[0].token,
                    notification: {
                        click_action:"task_details",
                        title: title,
                        body: type+ " Assign From Manager"
                    },
                    data: {  //you can send only notification or only data(or include both)
                        type: type,
                        id:task_id
                    }
                };
                fcm.send(message, function (err, response) {
                    if (err) {
                        console.log("Something has gone wrong!");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });
            }
        });
    }
    ,getlatestUsers:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(10* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select Distinct(app_user_id),usuarios.name, usuarios.surname,usuarios.email  from" +
            " module_tasks_locations,usuarios  where datetime>'"+time_date+"' AND" +
            "  module_tasks_locations.app_user_id=usuarios.id " +
            " AND module_tasks_locations.company_id='"+req.body.company_id+"'  order by app_user_id ",(err,resp)=>{
            console.log(err,resp.rows);
            res.send({
                "status":200,
                "data":resp.rows
            });
        });
    },getlatestUserslocationsmobile:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(20* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select Distinct(app_user_id),usuarios.name, usuarios.surname,usuarios.email  from" +
            " module_tasks_locations,usuarios  where datetime>'"+time_date+"' AND" +
            "  module_tasks_locations.app_user_id=usuarios.id " +
            " AND module_tasks_locations.company_id='"+req.body.company_id+"'  order by app_user_id ",(err,resp)=>{
            console.log(err,resp.rows);
            res.send({
                "status":200,
                "data":resp.rows
            });
        });
    },
    getlatestUsersLocationWeb:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(20* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select Distinct(app_user_id),usuarios.name, usuarios.surname,usuarios.email  from" +
            " module_tasks_locations,usuarios  where datetime>'"+time_date+"' AND" +
            "  module_tasks_locations.app_user_id=usuarios.id  order by app_user_id ",(err,resp)=>{
            console.log(err,resp.rows);
            res.send({
                "status":200,
                "data":resp.rows
            });
        });
    },
    getlatestUsersWeb:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(10* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select Distinct(app_user_id),usuarios.name, usuarios.surname,usuarios.email  from" +
            " module_tasks_locations,usuarios  where datetime>'"+time_date+"' AND" +
            "  module_tasks_locations.app_user_id=usuarios.id  order by app_user_id ",(err,resp)=>{
            console.log(err,resp.rows);
            res.send({
                "status":200,
                "data":resp.rows
            });
        });
    },
    workingNotificationHandle:function(req,res){
        //sendWorkingNotification ("Update Working ","Working ","Working",req)
    }
    ,
    taskDetailsById:function(req,res){
        client.query("select m_t.task_details,t.name as task_name, u.name as name," +
            " u.surname as surname, u.email,u_t.status, " +
            "u_t.completion_date as completion_date, " +
            "u_t.task_start_time,m_t.createdat as createdat from module_tasks as m_t, " +
            "tasks as t,assign_tasks_users_lists as u_t " +
            ",usuarios as u where m_t.id='"+req.body.id+"' AND " +
            " m_t.id=u_t.task_id AND m_t.task_id=t.id AND u_t.user_id=u.id",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"No Record Found"
                });
            }
        });
    },updateNotificationStatus(req,res){
        client.query("update notifications set status = '"+req.body.status+"' where id='"+req.body.id+"' ",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "message":"update Successfully"
                })
            }
            else{
                res.send({
                    "status":204,
                    "message":"Sorry Some Thing Wrong!"
                })
            }
        });
    },
    getmaquinarialist(req,res){
        client.query("select *from maquinaria where company_id='"+req.body.company_id+"' AND id >1",(err,resp)=>{
            console.log(err,resp);

            client.query("select *from maquinaria where id=1",(err,resp1)=>{
                res.send({
                    "status":200,
                    "data":resp.rows,
                    "none":resp1.rows
                })
            });

        });
    },
    readMyNotifications:function(req,res){
        client.query("select *from notifications where user_id='"+req.body.user_id+"' AND  " +
            " datetime > NOW() - INTERVAL '7 days' order by datetime ",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                })
            }
            else{
                res.send({
                    "status":204,
                    "message":"Empty Notifications"
                })
            }
        });
    },
    getAllGeoLocationUsers:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(1440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("SELECT *" +
            "FROM public.module_tasks_locations" +
            "  where datetime > '" + time_date + "' AND company_id='"+req.body.company_id+"'", (err, resp)=> {
            //console.log(err, resp);
            if(resp.rowCount>0) {
                data = resp.rows
            }
            client.query("SELECT DISTINCT(app_user_id) , count(app_user_id) as rows " +
                "FROM  module_tasks_locations" +
                "  where company_id='"+req.body.company_id+"'   AND datetime > '" + time_date + "' group by app_user_id " +
                "", (err, resp1)=> {
                console.log(err, resp1);
                res.send({
                    "status": 200,
                    "data": data,
                    "rowcount":resp1.rows
                });

            });

        });

    },getAllUsersLocations:function(req,res){
        var newDateObj = new Date();
        var time_date1 =new Date(newDateObj.getTime()).toISOString().slice(0, 19).replace('T', ' ');
        var time_date =new Date(newDateObj.getTime()-(1440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select  DISTINCT mtask.app_user_id, '"+time_date1+"'-mtask.datetime as current," +
            "mtask.latitude as latitude , mtask.longitude as longitude, " +
            "usuarios.name as user_name,tasks.name as task_name " +
            ", mtask.datetime as datetime from module_tasks_locations as" +
            " mtask, usuarios, tasks" +
            " where  mtask.datetime >='"+time_date+"' AND mtask.company_id='"+req.body.company_id+"' AND " +
            " mtask.app_user_id=usuarios.id AND tasks.id=mtask.task_id " +
            " ORDER BY mtask.app_user_id  DESC  ",
            (err,resp)=>{
                console.log(err,resp);
                res.send({
                    "status":200,
                    "data":resp.rows
                });

            });
    },getAllUsersPinTasks:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(2440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        var time_date1 =new Date(newDateObj.getTime()).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select  DISTINCT  mtask.app_user_id,  '"+time_date1+"'-mtask.datetime as current," +
            "mtask.latitude as latitude , mtask.longitude as longitude, " +
            "mtask.datetime as datetime from module_tasks_locations as " +
            " mtask" +
            " where  mtask.datetime >='"+time_date+"' "+
            " ORDER BY mtask.app_user_id  ",
            (err,resp)=>{
                console.log(err,resp);
                res.send({
                    "status":200,
                    "data":resp.rows,
                    "date":time_date1
                });

            });
    },
    getAllLocationPins:function(req,res) {

        var  disease;
        var  maintain;

        client.query("select m_d.reportedby_user_id as user_id, m_d.company_id," +
            " usuarios.name as name,usuarios.surname as lastname,usuarios.email as email," +
            "ds.name as disease_name," +
            "m_d.maintenace as details, m_d.image_url,m_d.thumbnial,m_d.location, m_d.reported_datetime  " +
            "from module_diseases as m_d,diseases as ds, usuarios " +
            "where m_d.company_id='" + req.body.company_id + "' AND m_d.disease_type=ds.id AND " +
            "m_d.reportedby_user_id=usuarios.id", (err, resp)=> {
            disease = resp.rows;

            client.query("select   usuarios.name as name,usuarios.surname as lastname,usuarios.email as email," +
                " mant.name as maintance_name,m_m.company_id,m_m.details," +
                "m_m.image_url,m_m.thumbnial,m_m.location, m_m.reported_date_time " +
                "from module_maintains as m_m,maintenances as mant,usuarios" +
                " where m_m.company_id='"+req.body.company_id+"' AND m_m.maintane_type=mant.id AND " +
                "m_m.reportedby_user_id=usuarios.id",
                (err,resp_m)=> {
                    maintain = resp_m.rows
                    client.query("select m_s.sample_name,m_s.location, usuarios.name as username,usuarios.surname as lastname," +
                        "usuarios.email as email, COALESCE(m_s.phenological_type,'') " +
                        "as phenological_type,m_s.thumbnail_url,m_s.image_url,COALESCE(m_s.cepa,'') as cepa," +
                        "COALESCE(m_s.observation,'') as observation,COALESCE(m_s.humedad_ambiental,'') as humedad_ambiental," +
                        "COALESCE(m_s.temparature,'') as temparature,COALESCE(m_s.hora,'') as hora," +
                        "COALESCE(m_s.ubicacion,'') as ubicacion,COALESCE(m_s.valor_scholander,'') as valor_scholander," +
                        "COALESCE(m_s.sample_type,'') as sample_type, COALESCE(m_s.cluster_per_unit_edit,'') as cluster_per_unit_edit," +
                        "COALESCE(m_s.boxes_per_field,'') as boxes_per_field ,COALESCE(m_s.kilogram_transport,'') as kilogram_transport," +
                        "COALESCE(m_s.machinery,'') as machinery,fb.name as field_name,COALESCE(m_s.sample_type_date,'') as sample_type_date," +
                        "COALESCE(m_s.sample_type_lning,0) as sample_type_lning," +
                        "COALESCE(m_s.sample_type_strain,0) as sample_type_strain," +
                        "COALESCE(m_s.sample_type_no_of_breaks,0) as sample_type_no_of_breaks,COALESCE(m_s.weight_purning,0) as weight_purning," +
                        "COALESCE(m_s.drop_buds,0) as drop_buds ,COALESCE(m_s.number_of_buds,0) as " +
                        "number_of_buds,COALESCE(m_s.number_of_bunches,0) as number_of_bunches ," +
                        "m_s.reported_datetime from module_samplings as m_s,fields as fb,usuarios  where " +
                        "m_s.company_id='"+req.body.company_id+"' AND " +
                        "m_s.reportedby_user_id=usuarios.id AND m_s.sample_type_field_id=fb.id",(err,resp_s)=>{
                        res.send({
                            "status": 200,
                            "sampling":resp_s.rows,
                            "maintain":maintain,
                            "disease": disease
                        });
                    });
                });
        });
    },
    getDiseaseLocations:function(req,res){
        client.query("select m_d.reportedby_user_id as user_id, m_d.company_id," +
            " usuarios.name,ds.name as disease_name," +
            "m_d.maintenace as details, m_d.image_url,m_d.thumbnial,m_d.location, m_d.reported_datetime  " +
            "from module_diseases as m_d,diseases as ds, usuarios " +
            "where m_d.company_id='"+req.body.company_id+"' AND m_d.disease_type=ds.id AND " +
            "m_d.reportedby_user_id=usuarios.id AND m_d.reported_datetime::date>='"+req.body.start_date+"'" +
            "  AND m_d.reported_datetime::date<='"+req.body.end_date+"'",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"sorry no report found"
                })
            }

        });
    },getMaintanceLocation:function (req,res) {
        client.query("select usuarios.name as username,mant.name as maintance_name,m_m.company_id,m_m.details," +
            "m_m.image_url,m_m.thumbnial,m_m.location, m_m.reported_date_time " +
            "from module_maintains as m_m,maintenances as mant,usuarios" +
            " where m_m.company_id='"+req.body.company_id+"' AND m_m.maintane_type=mant.id AND " +
            "m_m.reportedby_user_id=usuarios.id AND m_m.reported_date_time::date>='"+req.body.start_date+"'" +
            "  AND m_m.reported_date_time::date<='"+req.body.end_date+"'",
            (err,resp)=>{
                console.log(err,resp);
                if(resp.rowCount>0){
                    res.send({
                        "status":200,
                        "data":resp.rows
                    });
                }else{
                    res.send({
                        "status":204,
                        "message":"sorry no report found"
                    })
                }
            });
    },
    getNoteFieldLocation:function (req,res) {
        client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date, m_f.end_date," +
            "m_f.product,m_f.app_method,m_f.surface,m_f.location,m_f.reported_date_time," +
            "fb.name as field_name,lb.name as labor_name from  module_fieldnotebooks as m_f, labors as lb,fields as fb, usuarios where " +
            "m_f.company_id='"+req.body.company_id+"' AND  m_f.reportedby_user_id=usuarios.id AND " +
            "m_f.labore_id=lb.id AND m_f.field_id=fb.id AND m_f.reported_date_time::date>='"+req.body.start_date+"'" +
            "  AND m_f.reported_date_time::date<='"+req.body.end_date+"'",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"sorry no report found"
                });
            }
        });

    },getSamplingLocation:function (req,res) {
        client.query("select m_s.sample_name,m_s.location,usuarios.name as username, COALESCE(m_s.phenological_type,'') " +
            "as phenological_type,m_s.thumbnail_url,m_s.image_url," +
            "COALESCE(m_s.sample_type,'') as sample_type, COALESCE(m_s.cluster_per_unit_edit,'') as cluster_per_unit_edit," +
            "COALESCE(m_s.boxes_per_field,'') as boxes_per_field ,COALESCE(m_s.kilogram_transport,'') as kilogram_transport," +
            "COALESCE(m_s.machinery,'') as machinery,fb.name as field_name,COALESCE(m_s.sample_type_date,'') as sample_type_date," +
            "COALESCE(m_s.sample_type_lning,0) as sample_type_lning," +
            "COALESCE(m_s.sample_type_strain,0) as sample_type_strain," +
            "COALESCE(m_s.sample_type_no_of_breaks,0) as sample_type_no_of_breaks,COALESCE(m_s.weight_purning,0) as weight_purning," +
            "COALESCE(m_s.drop_buds,0) as drop_buds ,COALESCE(m_s.number_of_buds,0) as number_of_buds,COALESCE(m_s.number_of_bunches,0) as number_of_bunches ," +
            "m_s.reported_datetime from module_samplings as m_s,fields as fb,usuarios where " +
            "m_s.company_id='"+req.body.company_id+"' AND " +
            "m_s.reportedby_user_id=usuarios.id AND m_s.sample_type_field_id=fb.id AND m_s.reported_datetime::date>='"+req.body.start_date+"'" +
            "  AND m_s.reported_datetime::date<='"+req.body.end_date+"'",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                res.send({
                    'status':200,
                    'data':resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"sorry no report found"
                });
            }
        })
    },
    getAllUsersLocationsWeb:function(req,res){
        var newDateObj = new Date();
        var time_date1 =new Date(newDateObj.getTime()).toISOString().slice(0, 19).replace('T', ' ');
        var time_date =new Date(newDateObj.getTime()-(1440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select  DISTINCT mtask.app_user_id, '"+time_date1+"'-mtask.datetime as current," +
            "mtask.latitude as latitude , mtask.longitude as longitude, " +
            "usuarios.name as user_name,tasks.name as task_name " +
            ", mtask.datetime as datetime from module_tasks_locations as" +
            " mtask, usuarios, tasks" +
            " where  mtask.datetime >='"+time_date+"' AND " +
            " mtask.app_user_id=usuarios.id AND tasks.id=mtask.task_id " +
            " ORDER BY mtask.app_user_id  DESC  ",
            (err,resp)=>{
                console.log(err,resp);
                res.send({
                    "status":200,
                    "data":resp.rows
                });

            });
    },
    getAllGeoLocationUsersWeb:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(1440* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("SELECT *" +
            "FROM public.module_tasks_locations" +
            "  where datetime > '" + time_date + "'", (err, resp)=> {
            //console.log(err, resp);
            if(resp.rowCount>0) {
                data = resp.rows
            }
            client.query("SELECT DISTINCT(app_user_id) , count(app_user_id) as rows " +
                "FROM  module_tasks_locations" +
                "  where datetime > '" + time_date + "'  group by app_user_id ", (err, resp1)=> {
                console.log(err, resp1);
                res.send({
                    "status": 200,
                    "data": data,
                    "rowcount":resp1.rows
                });

            });

        });

    },updatePermissions:function(req,res){
        $id = req.param("company_id",0);
        client.query("select *from companies where id='"+$id+"'",(err,result)=>{
            if(result.rowCount>0){
                res.send({
                    "status":200,
                    "data":result.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Sorry Nothing Found"
                });
            }
        });
    },  getAllLocationPinsWeb:function(req,res) {
        var  disease;
        var  maintain;
        client.query("select m_d.reportedby_user_id as user_id, m_d.company_id," +
            " usuarios.name as name,usuarios.surname as lastname,ds.name as disease_name," +
            "m_d.maintenace as details, m_d.image_url,m_d.thumbnial,m_d.location, m_d.reported_datetime  " +
            "from module_diseases as m_d,diseases as ds, usuarios " +
            "where m_d.disease_type=ds.id AND " +
            "m_d.reportedby_user_id=usuarios.id", (err, resp)=> {
            disease = resp.rows;

            client.query("select  usuarios.name as username,usuarios.surname as lastname, mant.name as maintance_name,m_m.company_id,m_m.details," +
                "m_m.image_url,m_m.thumbnial,m_m.location, m_m.reported_date_time " +
                "from module_maintains as m_m,maintenances as mant,usuarios" +
                " where  m_m.maintane_type=mant.id AND " +
                "m_m.reportedby_user_id=usuarios.id",
                (err,resp_m)=> {
                    maintain = resp_m.rows
                    client.query("select m_s.sample_name,m_s.location,usuarios.name as username,usuarios.surname as lastname," +
                        " COALESCE(m_s.phenological_type,'') " +
                        "as phenological_type,m_s.thumbnail_url,m_s.image_url,COALESCE(m_s.cepa,'') as cepa," +
                        "COALESCE(m_s.observation,'') as observation,COALESCE(m_s.humedad_ambiental,'') as humedad_ambiental," +
                        "COALESCE(m_s.temparature,'') as temparature,COALESCE(m_s.hora,'') as hora," +
                        "COALESCE(m_s.ubicacion,'') as ubicacion,COALESCE(m_s.valor_scholander,'') as valor_scholander," +
                        "COALESCE(m_s.sample_type,'') as sample_type, COALESCE(m_s.cluster_per_unit_edit,'') as cluster_per_unit_edit," +
                        "COALESCE(m_s.boxes_per_field,'') as boxes_per_field ,COALESCE(m_s.kilogram_transport,'') as kilogram_transport," +
                        "COALESCE(m_s.machinery,'') as machinery,fb.name as field_name,COALESCE(m_s.sample_type_date,'') as sample_type_date," +
                        "COALESCE(m_s.sample_type_lning,0) as sample_type_lning," +
                        "COALESCE(m_s.sample_type_strain,0) as sample_type_strain," +
                        "COALESCE(m_s.sample_type_no_of_breaks,0) as sample_type_no_of_breaks,COALESCE(m_s.weight_purning,0) as weight_purning," +
                        "COALESCE(m_s.drop_buds,0) as drop_buds ,COALESCE(m_s.number_of_buds,0) as number_of_buds,COALESCE(m_s.number_of_bunches,0) as number_of_bunches ," +
                        "m_s.reported_datetime from module_samplings as m_s,fields as fb,usuarios where " +
                        "m_s.reportedby_user_id=usuarios.id AND m_s.sample_type_field_id=fb.id",(err,resp_s)=>{

                        res.send({
                            "status": 200,
                            "sampling":resp_s.rows,
                            "maintain":maintain,
                            "disease": disease
                        });
                    });
                });
        });
    }, getNoteFieldBooks:function(req,res) {
        if (req.body.form_type == 1) {
            client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date, m_f.end_date,maquinaria.name as maquinaria_name," +
                "m_f.product,m_f.app_method,m_f.surface,m_f.location,m_f.reported_date_time," +
                "fb.name as field_name,lb.name as labor_name from  module_fieldnotebooks as m_f, labors as lb,fields as fb," +
                " usuarios,maquinaria where " +
                " m_f.reportedby_user_id=usuarios.id AND " +
                "m_f.labore_id=lb.id AND m_f.field_id=fb.id AND" +
                " m_f.form_type='"+req.body.form_type+"'" +
                " AND m_f.company_id='"+req.body.company_id+"'  AND " +
                "maquinaria.id=m_f.marchinar_id  order by reported_date_time", (err, result)=> {
                console.log(result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });
        }else if (req.body.form_type == 2) {
            client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date,m_f.trabajador as trabajador" +
                ",maquinaria.name as maquinaria_name," +
                "m_f.tratamiento as tratamiento,m_f.dosis,m_f.observaciones as observaciones," +
                "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
                " from  module_fieldnotebooks as m_f,usuarios,fields as fb,maquinaria where " +
                " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
                "form_type='"+req.body.form_type+"' AND maquinaria.id=m_f.marchinar_id " +
                "AND m_f.company_id='"+req.body.company_id+"'", (err, result)=> {
                console.log(err,result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });

        }
        else if (req.body.form_type == 3) {
            client.query("select usuarios.name as username,m_f.trabajador as trabajador,m_f.start_date," +
                "m_f.tipodeabonado as tipodeabonado,m_f.dosis,m_f.observaciones as observaciones," +
                "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
                " from  module_fieldnotebooks as m_f,usuarios,fields as fb where " +
                " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
                "form_type='"+req.body.form_type+"' " +
                "AND m_f.company_id='"+req.body.company_id+"'", (err, result)=> {
                console.log(err,result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });

        }
        else if (req.body.form_type == 4) {
            client.query("select usuarios.name as username,m_f.start_date,m_f.subparcela as subparcela," +
                "m_f.horasderiego as horasderiego," +
                "m_f.dosis,m_f.observaciones as observaciones," +
                "m_f.location,m_f.reported_date_time,fb.name as field_name" +
                " from  module_fieldnotebooks as m_f,usuarios,fields as fb  where " +
                " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
                "form_type='"+req.body.form_type+"' " +
                "AND m_f.company_id='"+req.body.company_id+"'", (err, result)=> {
                console.log(err,result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });

        }
    },getNoteFieldBooksWeb:function(req,res) {
        if (req.body.form_type == 1) {
            client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date, m_f.end_date,maquinaria.name as maquinaria_name," +
                "m_f.product,m_f.app_method,m_f.surface,m_f.location,m_f.reported_date_time," +
                "fb.name as field_name,lb.name as labor_name from  module_fieldnotebooks as m_f, labors as lb,fields as fb," +
                " usuarios,maquinaria where " +
                " m_f.reportedby_user_id=usuarios.id AND " +
                "m_f.labore_id=lb.id AND m_f.field_id=fb.id AND" +
                " m_f.form_type='"+req.body.form_type+"'" +
                " AND m_f.company_id='"+req.body.company_id+"'  AND " +
                "maquinaria.id=m_f.marchinar_id  order by reported_date_time", (err, result)=> {
                console.log(result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });
        }else if (req.body.form_type == 2) {
            client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date,m_f.trabajador as trabajador" +
                ",maquinaria.name as maquinaria_name," +
                "m_f.tratamiento as tratamiento,m_f.dosis,m_f.observaciones as observaciones," +
                "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
                " from  module_fieldnotebooks as m_f,usuarios,fields as fb,maquinaria where " +
                " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
                "form_type='"+req.body.form_type+"' " +
                " AND m_f.company_id='"+req.body.company_id+"' " +
                "AND maquinaria.id=m_f.marchinar_id ", (err, result)=> {
                console.log(err,result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });

        }
        else if (req.body.form_type == 3) {
            client.query("select usuarios.name as username,m_f.trabajador as trabajador,m_f.start_date," +
                "m_f.tipodeabonado as tipodeabonado,m_f.dosis,m_f.observaciones as observaciones," +
                "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
                " from  module_fieldnotebooks as m_f,usuarios,fields as fb where " +
                " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
                "form_type='"+req.body.form_type+"' ", (err, result)=> {
                console.log(err,result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });

        }
        else if (req.body.form_type == 4) {
            client.query("select usuarios.name as username,m_f.start_date,m_f.subparcela as subparcela," +
                "m_f.horasderiego as horasderiego," +
                "m_f.dosis,m_f.observaciones as observaciones," +
                "m_f.location,m_f.reported_date_time,fb.name as field_name" +
                " from  module_fieldnotebooks as m_f,usuarios,fields as fb  where " +
                " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
                "form_type='"+req.body.form_type+"'", (err, result)=> {
                console.log(err,result);
                if(result.rowCount>0) {
                    res.send({
                        "status": 200,
                        "data": result.rows
                    });
                }else{
                    res.send({
                        "status": 204,
                        "messgae": "Sorry Not Record Found"
                    });
                }
            });

        }
    }, getAllGereralForm:function(req,res){
        client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date, m_f.end_date,maquinaria.name as maquinaria_name," +
            "m_f.product,m_f.app_method,m_f.surface,m_f.location,m_f.reported_date_time," +
            "fb.name as field_name,lb.name as labor_name from  module_fieldnotebooks as m_f, labors as lb,fields as fb," +
            " usuarios,maquinaria where " +
            " m_f.reportedby_user_id=usuarios.id AND " +
            "m_f.labore_id=lb.id AND m_f.field_id=fb.id AND" +
            " m_f.form_type='"+req.body.form_type+"' AND " +
            "maquinaria.id=m_f.marchinar_id  order by reported_date_time", (err, result)=> {
            console.log(result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },filerGeneralForm:function(req,res){
        client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date, m_f.end_date,maquinaria.name as maquinaria_name," +
            "m_f.product,m_f.app_method,m_f.surface,m_f.location,m_f.reported_date_time," +
            "fb.name as field_name,lb.name as labor_name from  module_fieldnotebooks as m_f, labors as lb,fields as fb," +
            " usuarios,maquinaria where " +
            " m_f.reportedby_user_id=usuarios.id AND " +
            "m_f.labore_id=lb.id AND m_f.field_id=fb.id AND" +
            " m_f.form_type='"+req.body.form_type+"'" +
            " AND m_f.company_id='"+req.body.company_id+"'  AND " +
            "maquinaria.id=m_f.marchinar_id  AND reported_date_time >='"+req.body.start_date+"'" +
            " AND reported_date_time<='"+req.body.end_date+"' order by reported_date_time", (err, result)=> {
            console.log(result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },getAllTreatmentoForm:function(req,res){
        client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date,m_f.trabajador as trabajador" +
            ",maquinaria.name as maquinaria_name," +
            "m_f.tratamiento as tratamiento,m_f.dosis,m_f.observaciones as observaciones," +
            "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
            " from  module_fieldnotebooks as m_f,usuarios,fields as fb,maquinaria where " +
            " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
            "form_type='"+req.body.form_type+"' AND maquinaria.id=m_f.marchinar_id ", (err, result)=> {
            console.log(err,result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },fillterTreatmento:function(req,res){
        client.query("select usuarios.name as username,m_f.marchinar_id,m_f.start_date,m_f.trabajador as trabajador" +
            ",maquinaria.name as maquinaria_name," +
            "m_f.tratamiento as tratamiento,m_f.dosis,m_f.observaciones as observaciones," +
            "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
            " from  module_fieldnotebooks as m_f,usuarios,fields as fb,maquinaria where " +
            " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
            "form_type='"+req.body.form_type+"' AND m_f.company_id='"+req.body.company_id+"'" +
            " AND m_f.reported_date_time>='"+req.body.start_date+"' AND m_f.reported_date_time<='"+req.body.end_date+"' " +
            " AND maquinaria.id=m_f.marchinar_id ", (err, result)=> {
            console.log(err,result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },getAllAbonadoForm:function (req,res) {
        client.query("select usuarios.name as username,m_f.trabajador as trabajador,m_f.start_date," +
            "m_f.tipodeabonado as tipodeabonado,m_f.dosis,m_f.observaciones as observaciones," +
            "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
            " from  module_fieldnotebooks as m_f,usuarios,fields as fb where " +
            " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
            "form_type='"+req.body.form_type+"' ", (err, result)=> {
            console.log(err,result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },filterAbonadoForm:function(req,res){
        client.query("select usuarios.name as username,m_f.trabajador as trabajador,m_f.start_date," +
            "m_f.tipodeabonado as tipodeabonado,m_f.dosis,m_f.observaciones as observaciones," +
            "m_f.product,m_f.location,m_f.reported_date_time,fb.name as field_name " +
            " from  module_fieldnotebooks as m_f,usuarios,fields as fb where " +
            " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
            "form_type='"+req.body.form_type+"' AND m_f.company_id='"+req.body.company_id+"' AND " +
            "m_f.reported_date_time>='"+req.body.start_date+"' AND m_f.reported_date_time<='"+req.body.end_date+"'", (err, result)=> {
            console.log(err,result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },getAllRiegoForm:function(req,res){
        client.query("select usuarios.name as username,m_f.start_date,m_f.subparcela as subparcela," +
            "m_f.horasderiego as horasderiego," +
            "m_f.dosis,m_f.observaciones as observaciones," +
            "m_f.location,m_f.reported_date_time,fb.name as field_name" +
            " from  module_fieldnotebooks as m_f,usuarios,fields as fb  where " +
            " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
            "form_type='"+req.body.form_type+"'", (err, result)=> {
            console.log(err,result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },getFilterRiegoForm:function(req,res){
        client.query("select usuarios.name as username,m_f.start_date,m_f.subparcela as subparcela," +
            "m_f.horasderiego as horasderiego," +
            "m_f.dosis,m_f.observaciones as observaciones," +
            "m_f.location,m_f.reported_date_time,fb.name as field_name" +
            " from  module_fieldnotebooks as m_f,usuarios,fields as fb  where " +
            " m_f.reportedby_user_id=usuarios.id AND m_f.field_id=fb.id AND " +
            "form_type='"+req.body.form_type+"' AND m_f.company_id='"+req.body.company_id+"' AND " +
            "m_f.reported_date_time>='"+req.body.start_date+"' AND m_f.reported_date_time<='"+req.body.end_date+"'" , (err, result)=> {
            console.log(err,result);
            if(result.rowCount>0) {
                res.send({
                    "status": 200,
                    "data": result.rows
                });
            }else{
                res.send({
                    "status": 204,
                    "messgae": "Sorry Not Record Found"
                });
            }
        });
    },
    sendVerificaionCode:function(req,res){
        constants.dashboard_url
        client.query("select *from usuarios where email='"+req.body.email+"'",(err,resp)=>{
            console.log(err,resp);
            if(resp.rowCount>0){
                var token = crypto.randomBytes(64).toString('hex');
                var code = crypto.randomBytes(8).toString('hex');
                myObj = new Object()
                myObj.user_id = resp.rows[0].id;
                myObj.email = resp.rows[0].email;
                myObj.token = token;
                myObj.code = code;
                client.query("insert into verification_codes(user_id, token, verification_code)" +
                    " values('"+resp.rows[0].id+"','"+token+"','"+code+"')",(err,resp1)=>{

                    axios.request({
                        method: 'POST',
                        url: 'https://app.e-stratos.eu/api/v1/login/',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            username: 'pablo.aibar@smartrural.net',
                            password: 'A9BBSZMB'
                        },
                    }).then(function (response) {
                        // handle success
                        console.log(response);
                    }).catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                        .finally(function () {
                            // always executed
                        });
                    /*   res.send({
                     "status":200,
                     "data":myObj,
                     });*/
                });

            }else{
                res.send({
                    "status":204,
                    "message":"Sorry user not found"
                });
            }
        });
    },getDiseaseListAdminFilter:function(req,res) {
        client.query("select m_d.id as id, m_d.reportedby_user_id as user_id, m_d.company_id,comp.name as company_name," +
            " usuarios.name,ds.name as disease_name," +
            "m_d.maintenace as details, m_d.image_url,m_d.thumbnial,m_d.location, m_d.reported_datetime  " +
            "from module_diseases as m_d,diseases as ds, companies as  comp, usuarios " +
            "where m_d.disease_type=ds.id AND comp.id=m_d.company_id AND  " +
            "m_d.reportedby_user_id=usuarios.id", (err, resp)=> {
            console.log(err, resp);
            if (resp.rowCount > 0) {
                res.send({
                    "status": 200,
                    "data": resp.rows
                });
            } else {
                res.send({
                    "status": 204,
                    "message": "sorry no report found"
                })
            }

        });
    },getDiseaseListSearch:function(req,res) {
        client.query("select m_d.id as id, m_d.reportedby_user_id as user_id, m_d.company_id,comp.name as company_name," +
            " usuarios.name,ds.name as disease_name," +
            "m_d.maintenace as details, m_d.image_url,m_d.thumbnial,m_d.location, m_d.reported_datetime  " +
            "from module_diseases as m_d,diseases as ds,companies as  comp,  usuarios " +
            "where m_d.disease_type=ds.id AND  comp.id=m_d.company_id AND  " +
            "m_d.reportedby_user_id=usuarios.id AND m_d.reported_datetime::date>='" + req.body.start_date + "'" +
            "  AND m_d.reported_datetime::date<='" + req.body.end_date + "'", (err, resp)=> {
            console.log(err, resp);
            if (resp.rowCount > 0) {
                res.send({
                    "status": 200,
                    "data": resp.rows
                });
            } else {
                res.send({
                    "status": 204,
                    "message": "sorry no report found"
                })
            }

        });
    },deleteDisease:function(req,res){
        client.query("delete from module_diseases where id='"+req.body.id+"'",(err,resp)=>{
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "message":"Delete Successfully"
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Sorry Try Again"
                });
            }
        });
    },
    getMaintainAdmin:function(req,res){
        client.query("select m_m.id as id, comp.name as company_name,usuarios.name as username, mant.name as maintance_name,m_m.company_id,m_m.details," +
            "m_m.image_url,m_m.thumbnial,m_m.location, m_m.reported_date_time " +
            "from module_maintains as m_m,maintenances as mant,companies as comp,usuarios" +
            " where  m_m.maintane_type=mant.id AND comp.id=m_m.company_id AND " +
            "m_m.reportedby_user_id=usuarios.id",(err,resp)=>{
            console.log(err,resp)
            if(resp.rowCount>0){
                res.send({
                    "status":200,
                    "data":resp.rows
                });
            }else{
                res.send({
                    "status":204,
                    "message":"no result found"
                });
            }
        });
    }
}

function endTask(task_id,user_id,status,company_id,resp){
    var time_date =getDate()+"-"+getTime()
    client.query("update assign_tasks_users_lists  set status='"+status+"' , completion_date= '"+time_date+"'" +
        " where task_id='"+task_id+"' AND user_id='"+user_id+"'",(err,res)=>{
        // console.log(err,res);
        if(res.rowCount>0){
            resp.send({
                "status":200,
                "message":"status updated"
            });
            sendOtherNotifications("Update Task"," Status Updated","Task",task_id,company_id)

        }else{
            resp.send({
                "status":204,
                "message":"Sorry Status not update"
            });
        }
    });
}

function start_task(task_id,user_id,status,company_id,resp){
    var time_date =getDate()+"-"+getTime();
    client.query("update assign_tasks_users_lists  set status='"+status+"' , task_start_time='"+time_date+"'" +
        " where task_id='"+task_id+"' AND user_id='"+user_id+"'",(err,res)=>{
        console.log(err,res);
        if(res.rowCount>0){
            resp.send({
                "status":200,
                "message":"status updated"
            });
            sendOtherNotifications("Update Task"," Status Updated","Task",task_id,company_id)
        }else{
            resp.send({
                "status":204,
                "message":"Sorry Status not update"
            });
        }
    });
}
function checkAlreadyTaskRunning(task_id,user_id,status,company_id,resp) {
    client.query("select task_id from assign_tasks_users_lists where  user_id='" + user_id + "'" +
        " AND status=1", (err, response) => {
        console.log(response.rowCount);
        if (response.rowCount > 0) {
            resp.send({
                "status": 204,
                "message": "Please first finish your old job."
            });
        } else {
            start_task(task_id,user_id,status,company_id,resp);
        }
    });
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

function sendOtherNotifications (title,message,type,task_id,company_id) {
    client.query("select  fcm_tokens.token from usuarios,fcm_tokens " +
        "where company='"+company_id+"' AND " +
        "role_id=2 AND usuarios.id=fcm_tokens.user_id",(err,res)=>{
        if(res.rowCount>0) {
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: res.rows[0].token,
                notification: {
                    click_action: 'task_details',
                    title: title,
                    body: type+ " Status Updated. Please check Task details"
                },
                data: {  //you can send only notification or only data(or include both)
                    type: type,
                    id:task_id
                }
            };
            fcm.send(message, function (err, response) {
                if (err) {
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
    });
}


function sendWorkingNotification (title,message,type,req) {
    client.query("select  fcm_tokens.token from usuarios,fcm_tokens " +
        "where company='"+req.body.company_id+"' AND " +
        "role_id=2 AND usuarios.id=fcm_tokens.user_id",(err,res)=>{
        if(res.rowCount>0) {
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: res.rows[0].token,
                notification: {
                    click_asction: 'main_activity',
                    title: title,
                    body: type+ " status updated. Please Check Map For  Details"
                },
                data: {  //you can send only notification or only data(or include both)
                    type: type,
                }
            };
            fcm.send(message, function (err, response) {
                if (err) {
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
    });
}