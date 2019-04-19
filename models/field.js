'use strict';
module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('fields', {
    company_id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    area: DataTypes.INTEGER
  }, {});
  Field.associate = function(models) {
    // associations can be defined here
  };
  return Field;
};