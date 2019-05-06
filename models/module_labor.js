'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_labor = sequelize.define('module_labor', {
    reportedby_user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    field_id: DataTypes.INTEGER,
    labor: DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    treatment: DataTypes.TEXT,
    method: DataTypes.TEXT,
    area: DataTypes.INTEGER,
    reported_date: DataTypes.DATE
  }, {});
  module_labor.associate = function(models) {
    // associations can be defined here
  };
  return module_labor;
};