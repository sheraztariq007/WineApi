'use strict';
module.exports = (sequelize, DataTypes) => {
  const tasks = sequelize.define('tasks', {
    name: DataTypes.TEXT
  }, {});
  tasks.associate = function(models) {
    // associations can be defined here
  };
  return tasks;
};