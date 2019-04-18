'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_tasks_fields = sequelize.define('user_tasks_fields', {
    task_id: DataTypes.INTEGER,
    field_id: DataTypes.INTEGER
  }, {});
  user_tasks_fields.associate = function(models) {
    // associations can be defined here
  };
  return user_tasks_fields;
};