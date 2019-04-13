'use strict';
module.exports = (sequelize, DataTypes) => {
  const labor = sequelize.define('labors', {
    company_id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    area: DataTypes.INTEGER
  }, {});
  labor.associate = function(models) {
    // associations can be defined here
  };
  return labor;
};