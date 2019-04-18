'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_tasks_date = sequelize.define('user_tasks_dates', {
    task_id: DataTypes.INTEGER,
    date: DataTypes.TEXT
  }, {});
  user_tasks_date.associate = function(models) {
    // associations can be defined here
  };
  return user_tasks_date;
};