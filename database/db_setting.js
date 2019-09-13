/**
 * Created by Abdullah on 9/12/2019.
 */

const  seq = require('../models/index');
const  AllowNotificationModules = require('../models/allow_notification_module');

module.exports = {

    getNotificationDetails:function(req,res){
        const notification = AllowNotificationModules(seq.sequelize,seq.sequelize.Sequelize);
        notification.findAll({
            where:{user_id:req.body.user_id}
        }).then(result=>{

            if(result.length>0){
                res.send({
                    "status":200,
                    "data":result
                })
            }else{
                res.send({
                    "status":204,
                    "message":"Sorry no result found"
                });
            }
        }).catch(err=>{

        });
    },
    updateNotificationStatus:function (req,res) {
        const notification = AllowNotificationModules(seq.sequelize,seq.sequelize.Sequelize);
        notification.update(
            {
                is_allow:req.body.is_allow
            },
            {
                where:{
                    user_id:req.body.user_id,
                    module_name:req.body.module_name
                }
            }
        ).then(result=>{
            if(result.length>0){
                res.send({
                    "status":200,
                    "message":"update successfully"
                });
            }else{
                res.send({
                    "status":204,
                    "message":"Sorry Try again"
                });
            }

        }).catch(err=>{
            console.log(err);
        });
    }
}