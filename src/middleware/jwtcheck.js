const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const { promisify } = require('util');
const { nodeAuthSecret } = require('../config/index');

const asyncVerify = promisify(jwt.verify);

function makeJwtCheckMiddleware({ userService }) {
  return async(req, res, next) => {
    const { authorization } = req.headers;

    if (typeof authorization === 'undefined') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);

      return;
    }

    try {
      const decodedToken = await asyncVerify(authorization, nodeAuthSecret);
      // eslint-disable-next-line require-atomic-updates
      req.user = await userService.getUserById(decodedToken.userId);

      return next();
    } catch (error) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  };
}

module.exports = makeJwtCheckMiddleware;
