const { DataTypes, Model } = require("sequelize");
const sequelize = require("./index");

class User extends Model {}

User.init(
  {
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
      allowNull: false,
      // allowNull defaults to true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    sekolah: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    petugas_lapangan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
    pendidikan_terakhir: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    jurusan: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    TTL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domisili: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "user", // We need to choose the model name
  }
);

// the defined model is the class itself
console.log(User === sequelize.models.User); //
module.exports =  User ;
