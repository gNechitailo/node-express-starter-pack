const initAppContext = require('../src/app-context-root');

initAppContext()
  .then((container) => {
    const periodicJobsRunner = container.resolve('periodicJobsRunner');

    periodicJobsRunner.run();
  });
