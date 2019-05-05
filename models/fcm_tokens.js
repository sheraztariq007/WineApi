'use strict';
module.exports = (sequelize, DataTypes) => {
  const fcm_tokens = sequelize.define('fcm_tokens', {
    user_id: DataTypes.INTEGER,
    token: DataTypes.TEXT
  }, {});
  fcm_tokens.associate = function(models) {
    // associations can be defined here
  };
  return fcm_tokens;
};