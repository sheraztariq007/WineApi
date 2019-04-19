'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_task = sequelize.define('module_tasks', {
    task_name: DataTypes.TEXT,
    task_details: DataTypes.TEXT,
    assign_from_id: DataTypes.INTEGER,
    completion_date: DataTypes.TEXT,
    target_date: DataTypes.TEXT,
    comment: DataTypes.TEXT,
    status:DataTypes.INTEGER,
    is_repeat: DataTypes.BOOLEAN,
    is_enable: DataTypes.BOOLEAN
  }, {});
  module_task.associate = function(models) {
    // associations can be defined here
  };
  return module_task;
};