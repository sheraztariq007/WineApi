'use strict';
module.exports = (sequelize, DataTypes) => {
  const disease = sequelize.define('diseases', {
    company_id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    area: DataTypes.INTEGER
  }, {});
  disease.associate = function(models) {
    // associations can be defined here
  };
  return disease;
};