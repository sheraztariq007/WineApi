'use strict';
module.exports = (sequelize, DataTypes) => {
  const maintenance = sequelize.define('maintenances', {
    company_id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    area: DataTypes.INTEGER
  }, {});
  maintenance.associate = function(models) {
    // associations can be defined here
  };
  return maintenance;
};