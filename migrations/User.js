const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.createTable('users',  {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        email: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        password: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        sekolah: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        alamat: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        petugas_lapangan: {
          type: DataTypes.INTEGER,
          // allowNull defaults to true
        },
        pendidikan_terakhir: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        jurusan: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        TTL: {
          type: DataTypes.STRING,
        },
        domisili: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        unit: {
          type: DataTypes.INTEGER,
          // allowNull defaults to true
        },
        foto: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        });
    },
    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('users');
    },
  };