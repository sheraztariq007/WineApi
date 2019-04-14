'use strict';
module.exports = (sequelize, DataTypes) => {
  const sample_types = sequelize.define('sample_types', {
    sample_name: DataTypes.TEXT
  }, {});
  sample_types.associate = function(models) {
    // associations can be defined here
  };
  return sample_types;
};