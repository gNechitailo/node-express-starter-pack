const assert = require('assert');

assert(process.env.POSTGRES_USER, 'POSTGRES_USER is not specified');
assert(process.env.POSTGRES_PASSWORD, 'POSTGRES_PASSWORD is not specified');
assert(process.env.POSTGRES_DB, 'POSTGRES_DB is not specified');
assert(process.env.DB_HOST, 'DB_HOST is not specified');

module.exports = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.DB_HOST,
  dialect: 'postgres',
};
