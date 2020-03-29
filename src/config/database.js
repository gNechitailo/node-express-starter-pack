const assert = require('assert');

assert(process.env.DB_USER, 'DB_USER is not specified');
assert(process.env.DB_PASS, 'DB_PASS is not specified');
assert(process.env.DB_NAME, 'DB_NAME is not specified');
assert(process.env.DB_HOST, 'DB_HOST is not specified');

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
};
