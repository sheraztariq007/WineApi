'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    n_title: DataTypes.TEXT,
    n_message: DataTypes.TEXT,
    n_type: DataTypes.TEXT,
    n_type_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    task_id: DataTypes.INTEGER,
    action_screen: DataTypes.TEXT,
    status: DataTypes.INTEGER,
    datetime: DataTypes.DATE
  }, {});
  notifications.associate = function(models) {
    // associations can be defined here
  };
  return notifications;
};