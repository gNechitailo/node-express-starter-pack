import database from './database';

module.exports = {

  // Database
  database,

  // MailService
  mailUser: process.env.M_USER,
  mailPass: process.env.M_PASS,
  mailFrom: process.env.M_FROM,
};
