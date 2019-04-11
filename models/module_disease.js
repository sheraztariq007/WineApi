'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_disease = sequelize.define('module_disease', {
    reportedBy_user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    disease_type: DataTypes.INTEGER,
    maintenace: DataTypes.TEXT,
    image_url: DataTypes.TEXT,
    location: DataTypes.TEXT,
    reported_datetime: DataTypes.DATE
  }, {});
  module_disease.associate = function(models) {
    // associations can be defined here
  };
  return module_disease;
};