/**
 * Created by Abdullah on 9/12/2019.
 */
const  seq = require('../models/index');
const  AllowNotificationModules = require('../models/allow_notification_module');
const  Usuarios = require('../models/usuarios');
const  constants = require("../config/constants");
var not_list = constants.getNotificationModules();
function addNotificationDetails(){
    const  nottifcation = AllowNotificationModules(seq.sequelize,seq.sequelize.Sequelize);
    const  user = Usuarios(seq.sequelize,seq.sequelize.Sequelize);
    user.findAll()
        .then(result=>{
            for(rs in result){
                console.log(result[rs].name);
                nottifcation.create({
                    user_id:result[rs].id,
                    module_name:not_list.START_STOP_NOTIFICATION,
                    is_allow:true
                });
            }
        });
}

addNotificationDetails();