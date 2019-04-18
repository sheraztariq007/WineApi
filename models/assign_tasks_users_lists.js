'use strict';
module.exports = (sequelize, DataTypes) => {
  const assign_tasks_users_lists = sequelize.define('assign_tasks_users_lists', {
    task_id: DataTypes.INTEGER,
    user_id: DataTypes.TEXT
  }, {});
  assign_tasks_users_lists.associate = function(models) {
    // associations can be defined here
  };
  return assign_tasks_users_lists;
};