const Sequelize = require("sequelize");

/**
 * Create a Sequelize instance. This can be done by passing
 * the connection parameters separately to the Sequelize constructor.
 */

const database = new Sequelize("absen", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  timezone: "+07:00",
});

// define semua models yang ada pada aplikasi
// db.books = require('./user.model')(sequelize, Sequelize);
module.exports = database;
