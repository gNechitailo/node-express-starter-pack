const express = require('express');
const path = require('path');
const logger = require('morgan');
const HttpStatus = require('http-status-codes');
const cors = require('cors');

function makeApp({ rootRouter }) {
  const app = express();

  app.use(require('body-parser').urlencoded({ extended: false }));
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
    next();
  });

  app.use(cors({ origin: '*' }));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/api/v1', rootRouter);

  app.use(express.static(path.join(__dirname, 'public')));

  // Catch 404 and forward to error handler
  app.use((req, res) => {
    res.sendStatus(HttpStatus.NOT_FOUND);
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Unexpected structure error', debug: error.message });
  });

  return app;
}

module.exports = makeApp;
