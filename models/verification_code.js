'use strict';
module.exports = (sequelize, DataTypes) => {
  const verification_code = sequelize.define('verification_code', {
    user_id: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    verification_code: DataTypes.TEXT,
    datetime: DataTypes.DATE
  }, {});
  verification_code.associate = function(models) {
    // associations can be defined here
  };
  return verification_code;
};