const express = require('express');
const HttpStatus = require('http-status-codes');

const router = new express.Router();

const authRouter = require('./auth');
const userRouter = require('./user');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
  const message = error.data ? error.data : { serverError: error.message };

  console.log(message);

  res
    .status(error.code || HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: message });
});

module.exports = router;
