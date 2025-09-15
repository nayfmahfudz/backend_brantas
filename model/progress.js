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
    },
    progress_100: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    foto: {
      type: DataTypes.BLOB,
    },
    TMA: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "Tinggi Muka Air (cm)",
    },
    debit: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "Debit (m3/dtk)",
    },
    luas_area_kegiatan: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "Luas Area Kegiatan (m2)",
    },
    panjang_saluran: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "Panjang Saluran (m')",
    },
    menutup_bocoran: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Menutup Bocoran (bh)",
    },
    angkat_sedimen: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "Angkat Sedimen (m3)",
    },
    pembersihan_sampah: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "Pembersihan Sampah (kg)",
    },
    pelumasan_pintu_air: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Pelumasan Pintu Air (bh)",
    },
    pengecatan_pintu_air: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Pengecatan Pintu Air (bh)",
    },
    angkat_potong_pohon: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Angkat/potong pohon (btrng)",
    },
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Kecamatan",
    },
    kota: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Kota/Kabupaten",
    },
    provinsi: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Provinsi",
    },
    kelurahan: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Kelurahan",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["id", "createdAt"],
      },
    ],
    sequelize,
    modelName: "Progress",
    tableName: "Progress",
  }
);

module.exports = Progress;
