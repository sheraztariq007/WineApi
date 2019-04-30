'use strict';
module.exports = (sequelize, DataTypes) => {
  const tasks_locations = sequelize.define('tasks_locations', {
    app_user_id: DataTypes.INTEGER,
    latitude: DataTypes.TEXT,
    longitude: DataTypes.TEXT,
    date_time: DataTypes.DATE
  }, {});
  tasks_locations.associate = function(models) {
    // associations can be defined here
  };
  return tasks_locations;
};