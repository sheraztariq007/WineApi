const {pool,Client} = require("pg");
var md5 = require("md5")
var dateTime = require('node-datetime');
var time = new Date();
var connectionString = "postgres://postgres:admin123@localhost:5432/test";
const client = new Client({
    connectionString:connectionString
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