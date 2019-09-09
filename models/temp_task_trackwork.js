'use strict';
module.exports = (sequelize, DataTypes) => {
  const temp_task_trackwork = sequelize.define('temp_task_trackwork', {
    user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    work_time: DataTypes.TEXT,
    work_date: DataTypes.TEXT,
    token: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {});
  temp_task_trackwork.associate = function(models) {
    // associations can be defined here
  };
  return temp_task_trackwork;
};