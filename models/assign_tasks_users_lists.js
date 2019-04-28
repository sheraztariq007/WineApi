'use strict';
module.exports = (sequelize, DataTypes) => {
  const assign_tasks_users_lists = sequelize.define('assign_tasks_users_lists', {
    task_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    completion_date: DataTypes.TEXT,
    task_start_time:DataTypes.TEXT
  }, {});
  assign_tasks_users_lists.associate = function(models) {
    // associations can be defined here
  };
  return assign_tasks_users_lists;
};