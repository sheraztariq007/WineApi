'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('module_samplings_comspec_pdc_decalogos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sample_type: {
        type: Sequelize.INTEGER
      },
      oidio_p: {
        type: Sequelize.TEXT
      },
      oidio_p: {
        type: Sequelize.TEXT
      },
      mildium_h: {
        type: Sequelize.TEXT
      },
      mildium_r: {
        type: Sequelize.TEXT
      },
      botrytis: {
        type: Sequelize.TEXT
      },
      excoriosis: {
        type: Sequelize.TEXT
      },
      acariosis: {
        type: Sequelize.TEXT
      },
      erinosis: {
        type: Sequelize.TEXT
      },
      polilla_del_racimo: {
        type: Sequelize.TEXT
      },
      altica: {
        type: Sequelize.TEXT
      },
      yesca: {
        type: Sequelize.TEXT
      },
      pajaros: {
        type: Sequelize.TEXT
      },
      helada: {
        type: Sequelize.TEXT
      },
      granizo: {
        type: Sequelize.TEXT
      },
      corrimiento: {
        type: Sequelize.TEXT
      },
      uvas_pasas: {
        type: Sequelize.TEXT
      },
      carencias: {
        type: Sequelize.TEXT
      },
      malas_hierbas: {
        type: Sequelize.TEXT
      },
      otros: {
        type: Sequelize.TEXT
      },
      racimo_numero: {
        type: Sequelize.TEXT
      },
      racimo_tamaño: {
        type: Sequelize.TEXT
      },
      racimo_tipo: {
        type: Sequelize.TEXT
      },
      racimo_peso: {
        type: Sequelize.TEXT
      },
      envero: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('module_samplings_comspec_pdc_decalogos');
  }
};