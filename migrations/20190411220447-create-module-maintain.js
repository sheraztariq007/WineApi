'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('module_maintains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportedBy_user_id: {
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER
      },
      maintane_type: {
        type: Sequelize.INTEGER
      },
      image_url: {
        type: Sequelize.TEXT
      },
      carto_image: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.STRING
      },
      reported_date_time: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('module_maintains');
  }
};