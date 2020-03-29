/* eslint-disable camelcase */
const CPUS_MINUS_ONE = -1;

module.exports = {
  apps: [
    {
      name: 'API',
      script: './bin/www',
      instances: CPUS_MINUS_ONE,
      autorestart: true,
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      env: {
        IS_PM2: true,
      },
    },
    {
      name: 'periodic_tasks',
      autorestart: true,
      script: './bin/start-cron.js',
    },
  ],
};
