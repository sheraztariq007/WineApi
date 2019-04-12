'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_sampling = sequelize.define('module_sampling', {
    reportedBy_user_id: DataTypes.INTEGER,
    sample_name: DataTypes.TEXT,
    sample_type: DataTypes.INTEGER,
    cluster_per_unit_edit: DataTypes.TEXT,
    boxes_per_field: DataTypes.TEXT,
    kilogram_transport: DataTypes.TEXT,
    machinery: DataTypes.TEXT,
    field_type: DataTypes.INTEGER,
    location: DataTypes.TEXT,
    reported_datetime: DataTypes.TEXT
  }, {});
  module_sampling.associate = function(models) {
    // associations can be defined here
  };
  return module_sampling;
};