'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_role = sequelize.define('user_roles', {
    role_name: DataTypes.TEXT
  }, {});
  user_role.associate = function(models) {
    // associations can be defined here
  };
  return user_role;
};