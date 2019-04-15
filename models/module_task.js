'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_task = sequelize.define('module_task', {
    task_name: DataTypes.TEXT,
    task_details: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    creation_date: DataTypes.TEXT,
    completion_data: DataTypes.TEXT,
    target_data: DataTypes.TEXT,
    comment: DataTypes.TEXT,
    is_repeat: DataTypes.BOOLEAN
  }, {});
  module_task.associate = function(models) {
    // associations can be defined here
  };
  return module_task;
};