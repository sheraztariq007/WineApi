'use strict';
module.exports = (sequelize, DataTypes) => {
  const area = sequelize.define('area', {
    name: DataTypes.TEXT
  }, {});
  area.associate = function(models) {
    // associations can be defined here
  };
  return area;
};