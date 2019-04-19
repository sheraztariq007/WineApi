const {pool,Client} = require("pg");
var md5 = require("md5")

var connectionString = "postgres://postgres:admin123@localhost:5432/test";
const client = new Client({
    connectionString:connectionString
});
client.connect();
module.exports = {
   MyTasks:function(res1){
       client.query("select  task_name,task_details,assign_from_id,status,assign_tasks_users_lists.user_id, u.email" +
           " from module_tasks ,assign_tasks_users_lists, usuarios as u where assign_from_id=1" +
           " AND  module_tasks.id=assign_tasks_users_lists.task_id AND assign_tasks_users_lists.user_id=u.id" ,(err,res)=>{
           res1.send({"send":res.rows})
       client.end();
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
        client.query("select  module_tasks.id,task_name,task_details,assign_from_id,status from  assign_tasks_users_lists,module_tasks " +
            "where   assign_tasks_users_lists.task_id=module_tasks.id AND assign_tasks_users_lists.user_id='"+user_id+"' " ,(err,res)=>{
            //console.log(err,res);
            res1.send({"send":res.rows})
    });
    },
    taskWithFields:function(field_id,res1){
        client.query("Select name from fields, user_tasks_fields where fields.id=user_tasks_fields.field_id AND user_tasks_fields.task_id=13" ,(err,res)=>{
            //console.log(err,res);
            res1.send({"send":res.rows})
    });
    }
}