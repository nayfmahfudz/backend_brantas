const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.createTable('unit',  {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          nama_unit: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          satker: {
            type: DataTypes.STRING,
            // allowNull defaults to true
          },
          created: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          bidang: {
            type: DataTypes.STRING,
            // allowNull defaults to true
          },
        });
    },
    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('unit');
    },
  };