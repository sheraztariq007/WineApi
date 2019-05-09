'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_maintain = sequelize.define('module_maintain', {
    reportedby_user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    maintane_type: DataTypes.INTEGER,
    details: DataTypes.TEXT,
    image_url: DataTypes.TEXT,
    thumbnial: DataTypes.TEXT,
    carto_image: DataTypes.TEXT,
    location: DataTypes.STRING,
    reported_date_time: DataTypes.STRING
  }, {});
  module_maintain.associate = function(models) {
    // associations can be defined here
  };
  return module_maintain;
};