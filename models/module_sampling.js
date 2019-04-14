'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_sampling = sequelize.define('module_sampling', {
    reportedBy_user_id: DataTypes.INTEGER,
    sample_name: DataTypes.TEXT,
    sample_type: DataTypes.TEXT,
    cluster_per_unit_edit: DataTypes.TEXT,
    boxes_per_field: DataTypes.TEXT,
    kilogram_transport: DataTypes.TEXT,
    machinery: DataTypes.TEXT,
    field_type: DataTypes.INTEGER,
    location: DataTypes.TEXT,
    reported_datetime: DataTypes.TEXT,
    sample_type_field_id:DataTypes.INTEGER,
    sample_type_date:DataTypes.TEXT,
    sample_type_lning:DataTypes.INTEGER,
    sample_type_strain:DataTypes.INTEGER,
    sample_type_no_of_breaks:DataTypes.INTEGER,
    weight_purning:DataTypes.INTEGER,
    drop_buds:DataTypes.INTEGER,
    number_of_buds:DataTypes.INTEGER,
    number_of_bunches:DataTypes.INTEGER
  }, {});
  module_sampling.associate = function(models) {
    // associations can be defined here
  };
  return module_sampling;
};