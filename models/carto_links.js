'use strict';
module.exports = (sequelize, DataTypes) => {
  const carto_links = sequelize.define('carto_links', {
    company_id: DataTypes.INTEGER,
    show_name: DataTypes.TEXT,
    link: DataTypes.TEXT
  }, {});
  carto_links.associate = function(models) {
    // associations can be defined here
  };
  return carto_links;
};