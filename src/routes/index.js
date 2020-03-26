const express = require('express');
const path = require('path');
const YAML = require('yamljs');
const Sequelize = require('sequelize');
const HttpStatus = require('http-status-codes');

const HttpError = require('../controllers/http-error');

const router = new express.Router();

const authRouter = require('./auth');
const userRouter = require('./user');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function extractMessage(error) {
  if (error instanceof HttpError) {
    return error.data;
  }
  if (process.env.NODE_ENV === 'production') {
    return { serverError: 'Something went wrong. Please try again later' };
  }

  if (error instanceof Sequelize.Error) {
    return { sql: error.sql, message: error.message };
  }

  return { serverError: error.message };
}

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
  const message = extractMessage(error);

  res
    .status(error.code || HttpStatus.INTERNAL_SERVER_ERROR)
    .json(message);
});

module.exports = router;
