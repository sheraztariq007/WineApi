'use strict';
module.exports = (sequelize, DataTypes) => {
  const treatment_joins_field = sequelize.define('treatment_joins_field', {
    treatment_id: DataTypes.INTEGER,
    field_id: DataTypes.INTEGER
  }, {});
  treatment_joins_field.associate = function(models) {
    // associations can be defined here
  };
  return treatment_joins_field;
};