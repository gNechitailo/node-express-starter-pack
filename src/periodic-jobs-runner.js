const cron = require('node-cron');

class PeriodicJobsRunner {
  constructor({ authService, mailService }) {
    this.authService = authService;
    this.mailService = mailService;
  }

  run() {
    cron.schedule('0 2 */10 * *', () => {
      this.authService.cleanOutdatedTokens();
    }).start();

    cron.schedule('*/10 * * * * *', () => {
      this.mailService.sendMail();
    }).start();
  }
}

module.exports = PeriodicJobsRunner;
