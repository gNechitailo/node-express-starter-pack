const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { database } = require('../config');
const db = {};

const SLICE = -3;
const sequelize = new Sequelize(database.database, database.username, database.password, {
  ...database,
  logging: null, // This is to prevent sequelize logging to console (but keep debug)
});

// eslint-disable-next-line no-sync
fs
  .readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(SLICE) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));

    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.ModelError = Sequelize.Error;
db.extractErrorInfo = ({ sql, message }) => ({ sql, message });

module.exports = db;
