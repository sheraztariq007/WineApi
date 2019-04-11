'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_fieldnotebook = sequelize.define('module_fieldnotebook', {
    reportedby_user_id: DataTypes.INTEGER,
    marchinar_id: DataTypes.TEXT,
    labore_id: DataTypes.INTEGER,
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    product: DataTypes.STRING,
    app_method: DataTypes.STRING,
    field_id: DataTypes.INTEGER,
    surface: DataTypes.STRING,
    location: DataTypes.STRING,
    reported_date_time: DataTypes.STRING
  }, {});
  module_fieldnotebook.associate = function(models) {
    // associations can be defined here
  };
  return module_fieldnotebook;
};