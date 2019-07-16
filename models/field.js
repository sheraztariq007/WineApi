'use strict';
module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('fields', {
    company_id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    area: DataTypes.INTEGER,
    geo_json: DataTypes.TEXT,
    shape_type: DataTypes.TEXT
  }, {});
  Field.associate = function(models) {
    // associations can be defined here
  };
  return Field;
};