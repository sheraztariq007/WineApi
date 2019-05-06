const {pool,Client} = require("pg");
var md5 = require("md5")
var dateTime = require('node-datetime');
var time = new Date();
const  constants = require('../config/constants.json')
var FCM = require('fcm-node');
var serverKey = constants.server_key; //put your server key here
var fcm = new FCM(serverKey);

const client = new Client({
    connectionString:constants.database_url
});
client.connect();
module.exports = {
    AssignTasks:function(user_id,res1){
        client.query("select  module_tasks.id ,tasks.name as task_name,module_tasks.target_date as deadline , " +
            "task_details,assign_from_id,assign_tasks_users_lists.status as status,assign_tasks_users_lists.user_id, u.email" +
            " from module_tasks ,assign_tasks_users_lists, tasks, usuarios as u where assign_from_id='"+user_id+"'" +
            " AND  module_tasks.id=assign_tasks_users_lists.task_id AND module_tasks.task_id=tasks.id AND assign_tasks_users_lists.user_id=u.id" ,(err,res)=>{
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
        console.log(md5(password))

        client.query("select usuarios.id,usuarios.email,usuarios.role_id,usuarios.company," +
            "usuarios.password,usuarios.name,usuarios.surname,usuarios.group," +
            "usuarios.phone,usuarios.last_login_date," +
            "usuarios.account_disabled,usuarios.module_task,usuarios.module_diseases," +
            "usuarios.module_maintenance,usuarios.module_gathering," +
            "user_roles.role_name " +
            "from usuarios,user_roles where" +
            " usuarios.email='"+email+"' AND usuarios.password='"+md5(password)+"' AND usuarios.role_id=user_roles.id LIMIT 1",(err,resp)=>{
            // console.log(err,resp);
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
            "where  assign_tasks_users_lists.task_id=module_tasks.id AND module_tasks.task_id=tasks.id  AND assign_tasks_users_lists.user_id='"+user_id+"' " ,(err,res)=>{
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
    updatTaskStatus:function(task_id,user_id,status,resp){
        if(status==1){
            checkAlreadyTaskRunning(task_id,user_id,status,resp);
        }else{
            endTask(task_id,user_id,status,resp);
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
            ",ST_GeomFromText('POINT("+req.body.latitude+" "+req.body.longitude+")'), '"+time_date+"' )"
            ,(err,resp)=>{
            console.log(err,resp);
    });
    },

    getUsersLocations:function(req,res){
        var newDateObj = new Date();
        var time_date =new Date(newDateObj.getTime()-(10* 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
        client.query("select  DISTINCT mtask.app_user_id," +
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
        client.query("SELECT *" +
            "FROM public.module_tasks_locations  where app_user_id="+req.body.user_id+" AND task_id="+req.body.task_id+" AND" +
            " datetime  >= 'today' and datetime < 'tomorrow'", (err,resp)=>{
            console.log(err,resp);
        res.send({
            "status":200,
            "data":resp.rows
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
        client.query("SELECT  usuarios.name as name , module_diseases.id as disease_id," +
            " diseases.name as diseases_name,module_diseases.image_url as image_url," +
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
        client.query("SELECT  usuarios.name as name , module_maintains.id as maintain_id," +
            " maintenances.name as maintenances_name,module_maintains.image_url as image_url," +
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
        client.query("Select module_fieldnotebooks.marchinar_id as marchinar_id ," +
            " module_fieldnotebooks.start_date as start_date, module_fieldnotebooks.end_date as end_date," +
            "module_fieldnotebooks.product as product," +
            " module_fieldnotebooks.app_method as app_method, module_fieldnotebooks.surface as surface," +
            "module_fieldnotebooks.location as location, " +
            "module_fieldnotebooks.reported_date_time  as reported_date_time, fields.name as field_name, " +
            "labors.name as labors_name" +
            " from usuarios,labors,fields,module_fieldnotebooks where " +
            " module_fieldnotebooks.id='"+req.body.id+"' " +
            "AND module_fieldnotebooks.reportedby_user_id=usuarios.id AND " +
            " module_fieldnotebooks.labore_id=labors.id AND  module_fieldnotebooks.field_id=fields.id ",(err,resp)=>{
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
        client.query("SELECT " +
            "m_s.sample_type_field_id as sample_type_field_name, m_s.field_type as field_type_name" +
            ",m_s.sample_name as sample_name, m_s.sample_type as sample_type, m_s.cluster_per_unit_edit," +
            "m_s.boxes_per_field, m_s.kilogram_transport, m_s.machinery, " +
            "m_s.location,m_s.sample_type_date,m_s.sample_type_lning,m_s.sample_type_strain," +
            "m_s.sample_type_no_of_breaks, m_s.weight_purning,m_s.drop_buds,m_s.number_of_buds," +
            "m_s.number_of_bunches, m_s.reported_datetime from module_samplings as m_s where m_s.id = '"+req.body.id+"' ",(err,resp)=>{
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
    }
}

function endTask(task_id,user_id,status,resp){
    var time_date =getDate()+"-"+getTime()
    client.query("update assign_tasks_users_lists  set status='"+status+"' , completion_date= '"+time_date+"'" +
        " where task_id='"+task_id+"' AND user_id='"+user_id+"'",(err,res)=>{
        // console.log(err,res);
        if(res.rowCount>0){
        resp.send({
            "status":200,
            "message":"status updated"
        });
    }else{
        resp.send({
            "status":204,
            "message":"Sorry Status not update"
        });
    }
});
}

function start_task(task_id,user_id,status,resp){
    var time_date =getDate()+"-"+getTime();
    client.query("update assign_tasks_users_lists  set status='"+status+"' , task_start_time='"+time_date+"'" +
        " where task_id='"+task_id+"' AND user_id='"+user_id+"'",(err,res)=>{
        console.log(err,res);
    if(res.rowCount>0){
        resp.send({
            "status":200,
            "message":"status updated"
        });
    }else{
        resp.send({
            "status":204,
            "message":"Sorry Status not update"
        });
    }
});
}
function checkAlreadyTaskRunning(task_id,user_id,status,resp) {
    client.query("select task_id from assign_tasks_users_lists where  user_id='" + user_id + "' AND status=1", (err, response) => {
        console.log(response.rowCount);
    if (response.rowCount > 0) {
        resp.send({
            "status": 204,
            "message": "Please first finish your old job."
        });
    } else {
        start_task(task_id,user_id,status,resp);
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

function notifications(title,message,type,id,req){


}