'use strict';
module.exports = (sequelize, DataTypes) => {
  const maquinaria = sequelize.define('maquinaria', {
    name: DataTypes.TEXT,
    company_id: DataTypes.INTEGER
  }, {});
  maquinaria.associate = function(models) {
    // associations can be defined here
  };
  return maquinaria;
};