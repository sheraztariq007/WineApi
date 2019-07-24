'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_tasks_trackhours = sequelize.define('module_tasks_trackhours', {
    user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    total_hours: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {});
  module_tasks_trackhours.associate = function(models) {
    // associations can be defined here
  };
  return module_tasks_trackhours;
};