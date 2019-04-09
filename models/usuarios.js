'use strict';
module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define('Usuarios', {
    id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    company: DataTypes.INTEGER,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    group: DataTypes.STRING,
    phone: DataTypes.STRING,
    last_login_date: DataTypes.DATE,
    signUp_date: DataTypes.DATE,
    account_disabled: DataTypes.BOOLEAN,
    module_task: DataTypes.BOOLEAN,
    module_diseases: DataTypes.BOOLEAN,
    module_fieldNotebook: DataTypes.BOOLEAN,
    module_maintenance: DataTypes.BOOLEAN,
    module_gathering: DataTypes.BOOLEAN
  }, {});
  Usuarios.associate = function(models) {
    // associations can be defined here
  };
  return Usuarios;
};