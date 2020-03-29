const database = require('./database');

const DEFAULT_REFRESH_TOKEN_LIFETIME_DAYS = 30;
const DEFAULT_SMTP_PORT = 587;
const DEFAULT_HTTP_PORT = 3000;

module.exports = {

  // Database
  database,

  port: process.env.PORT || DEFAULT_HTTP_PORT,
  isPM2: process.env.IS_PM2,

  // MailService
  mailUser: process.env.M_USER,
  mailPass: process.env.M_PASS,
  mailFrom: process.env.M_FROM,

  nodeAuthSecret: process.env.NODE_AUTH_SECRET,

  frontendOrigin: process.env.FRONTEND_ORIGIN,

  smtpPort: process.env.SMTP_PORT || DEFAULT_SMTP_PORT,

  refreshTokenLifetimeDays: parseInt(process.env.REFRESH_TOKEN_LIFETIME_DAYS) || DEFAULT_REFRESH_TOKEN_LIFETIME_DAYS,
};
