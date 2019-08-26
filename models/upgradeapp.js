'use strict';
module.exports = (sequelize, DataTypes) => {
  const UpgradeApp = sequelize.define('upgrade_app', {
    version_code: DataTypes.TEXT,
    version_name: DataTypes.TEXT,
    message: DataTypes.TEXT,
    allow_update: DataTypes.BOOLEAN
  }, {});
  UpgradeApp.associate = function(models) {
    // associations can be defined here
  };
  return UpgradeApp;
};