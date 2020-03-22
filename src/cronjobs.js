const cron = require('node-cron');
const authService = require('./services/authService');
const mailService = require('./services/mailService');

module.exports = function start() {
  // If started with PM2 and is "main" process
  if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE !== 0) {
    return;
  }

  cron.schedule('0 2 */10 * *', () => {
    authService.cleanOutdatedTokens();
  });

  cron.schedule('*/10 * * * * *', () => {
    mailService.sendMail();
  }).start();
};
