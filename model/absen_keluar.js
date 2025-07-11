const { DataTypes, Model } = require("sequelize");
const sequelize = require("./index");

class AbsenKeluar extends Model {}

AbsenKeluar.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longtitude: {
      type: DataTypes.STRING,
      // allowNull defaults to true
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
        type: DataTypes.BLOB,
        // allowNull defaults to true
      },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "AbsenKeluar",
    tableName: 'absenkeluar', // We need to choose the model name
  }
);

module.exports =  AbsenKeluar ;
// the defined model is the class itself
console.log(AbsenKeluar === sequelize.models.AbsenKeluar); //
