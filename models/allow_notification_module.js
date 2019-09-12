'use strict';
module.exports = (sequelize, DataTypes) => {
  const allow_notification_module = sequelize.define('allow_notification_module', {
    user_id: DataTypes.INTEGER,
    module_name: DataTypes.TEXT,
    is_allow: DataTypes.BOOLEAN
  }, {});
  allow_notification_module.associate = function(models) {
    // associations can be defined here
  };
  return allow_notification_module;
};