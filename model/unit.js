const {  DataTypes, Model } = require("sequelize");
const sequelize = require("./index");

class Unit extends Model {}

Unit.init(
  {
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
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "units", // We need to choose the model name
  }
);

// the defined model is the class itself
console.log(Unit === sequelize.models.Unit); //
module.exports =  Unit ;