'use strict';
module.exports = (sequelize, DataTypes) => {
  const app_version = sequelize.define('app_version', {
    version_name: DataTypes.TEXT,
    old_version_name: DataTypes.TEXT,
    apk_file_link: DataTypes.TEXT,
    allow: DataTypes.INTEGER,
    datetime: DataTypes.DATE
  }, {});
  app_version.associate = function(models) {
    // associations can be defined here
  };
  return app_version;
};