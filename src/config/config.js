module.exports = {

  // Database
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',

  // MailService
  mailUser: process.env.M_USER,
  mailPass: process.env.M_PASS,
  mailFrom: process.env.M_FROM,
};
