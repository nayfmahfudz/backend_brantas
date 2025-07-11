const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.createTable('AbsenMasuk',   {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          latitude: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          longtitude: {
            type: DataTypes.STRING,
            // allowNull defaults to true
          },
          created: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          lokasi_absen: {
            type: DataTypes.STRING,
            // allowNull defaults to true
          },
          type_absen: {
              type: DataTypes.STRING,
              // allowNull defaults to true
            },
            foto: {
              type: DataTypes.STRING,
              // allowNull defaults to true
            },
        });
    },
    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('AbsenMasuk');
    },
  };