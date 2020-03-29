const express = require('express');
const path = require('path');
const YAML = require('yamljs');
const HttpStatus = require('http-status-codes');
const swaggerUi = require('swagger-ui-express');

const HttpError = require('../controllers/http-error');

function makeRootRouter({ authRouter, userRouter, models }) {
  const router = new express.Router();

  const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));

  function extractMessage(error) {
    if (error instanceof HttpError) {
      return error.data;
    }
    if (process.env.NODE_ENV === 'production') {
      return { serverError: 'Something went wrong. Please try again later' };
    }

    if (error instanceof models.ModelError) {
      return models.extractErrorInfo(error);
    }

    return { serverError: error.message };
  }

  router.use('/auth', authRouter);
  router.use('/user', userRouter);
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // eslint-disable-next-line no-unused-vars
  router.use((error, req, res, next) => {
    const message = extractMessage(error);

    res
      .status(error.code || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(message);
  });

  return router;
}

module.exports = makeRootRouter;
