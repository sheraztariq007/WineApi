'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_tasks_trackwork = sequelize.define('module_tasks_trackwork', {
    user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    work_time: DataTypes.STRING,
    work_date: DataTypes.STRING,
    token: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {});
  module_tasks_trackwork.associate = function(models) {
    // associations can be defined here
  };
  return module_tasks_trackwork;
};