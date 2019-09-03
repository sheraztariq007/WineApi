'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_samplings_comspec_pdc_decalogo = sequelize.define('module_samplings_comspec_pdc_decalogo', {
    sample_type: DataTypes.INTEGER,
    oidio_p: DataTypes.TEXT,
    oidio_p: DataTypes.TEXT,
    mildium_h: DataTypes.TEXT,
    mildium_r: DataTypes.TEXT,
    botrytis: DataTypes.TEXT,
    excoriosis: DataTypes.TEXT,
    acariosis: DataTypes.TEXT,
    erinosis: DataTypes.TEXT,
    polilla_del_racimo: DataTypes.TEXT,
    altica: DataTypes.TEXT,
    yesca: DataTypes.TEXT,
    pajaros: DataTypes.TEXT,
    helada: DataTypes.TEXT,
    granizo: DataTypes.TEXT,
    corrimiento: DataTypes.TEXT,
    uvas_pasas: DataTypes.TEXT,
    carencias: DataTypes.TEXT,
    malas_hierbas: DataTypes.TEXT,
    otros: DataTypes.TEXT,
    racimo_numero: DataTypes.TEXT,
    racimo_tamaño: DataTypes.TEXT,
    racimo_tipo: DataTypes.TEXT,
    racimo_peso: DataTypes.TEXT,
    envero: DataTypes.TEXT
  }, {});
  module_samplings_comspec_pdc_decalogo.associate = function(models) {
    // associations can be defined here
  };
  return module_samplings_comspec_pdc_decalogo;
};