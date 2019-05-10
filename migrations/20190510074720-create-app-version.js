'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('app_versions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      version_name: {
        type: Sequelize.TEXT
      },
      old_version_name: {
        type: Sequelize.TEXT
      },
      apk_file_link: {
        type: Sequelize.TEXT
      },
      allow: {
        type: Sequelize.INTEGER
      },
      datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('app_versions');
  }
};