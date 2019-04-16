'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_task = sequelize.define('module_tasks', {
    task_name: DataTypes.TEXT,
    task_details: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    assign_from_id: DataTypes.INTEGER,
    creation_date: DataTypes.TEXT,
    completion_date: DataTypes.TEXT,
    target_date: DataTypes.TEXT,
    comment: DataTypes.TEXT,
    is_repeat: DataTypes.BOOLEAN
  }, {});
  module_task.associate = function(models) {
    // associations can be defined here
  };
  return module_task;
};