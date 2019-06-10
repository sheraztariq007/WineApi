'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('companies', {
    name: DataTypes.STRING,
    contactmail: DataTypes.STRING,
    module_tasks: DataTypes.BOOLEAN,
    module_disease: DataTypes.BOOLEAN,
    module_mantain: DataTypes.BOOLEAN,
    module_sampling: DataTypes.BOOLEAN,
    module_notefield: DataTypes.BOOLEAN,
    contactphone: DataTypes.TEXT,
    createDate: DataTypes.DATE
  }, {});
  Company.associate = function(models) {
    // associations can be defined here
  };
  return Company;
};