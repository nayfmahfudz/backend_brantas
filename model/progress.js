const { DataTypes, Model } = require("sequelize");
const sequelize = require("./index");

class Progress extends Model {}

Progress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
    },
    progress_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    progress_50: {
      type: DataTypes.STRING,
      allowNull: true,
      // allowNull defaults to true
    },
    progress_100: {
      type: DataTypes.STRING,
      allowNull: true,
      // allowNull defaults to true
    },
    createdAt: {
      type: DataTypes.DATE,
      // allowNull defaults to true
    },
    foto: {
      type: DataTypes.BLOB,
      // allowNull defaults to true
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["id", "createdAt"],
      },
    ],
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Progress",
    tableName: "Progress", // We need to choose the model name
  }
);

module.exports = Progress;
// the defined model is the class itself
