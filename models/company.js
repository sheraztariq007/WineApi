'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('companies', {
    name: DataTypes.STRING,
    contactMail: DataTypes.STRING,
    contactPhone: DataTypes.INTEGER,
    createDate: DataTypes.DATE
  }, {});
  Company.associate = function(models) {
    // associations can be defined here
  };
  return Company;
};