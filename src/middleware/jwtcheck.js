const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const { promisify } = require('util');
const { nodeAuthSecret } = require('../config/index');

const asyncVerify = promisify(jwt.verify);

module.exports = async(req, res, next) => {
  const authorization = req.headers;

  if (typeof jwtHeader === 'undefined') {
    res.sendStatus(HttpStatus.FORBIDDEN);

    return;
  }

  const JWT = authorization.split(' ');
  const jwtToken = JWT[1];

  try {
    const decodedToken = await asyncVerify(jwtToken, nodeAuthSecret);
    req.userId = decodedToken.userId;

    return next();
  } catch (error) {
    res.sendStatus(HttpStatus.FORBIDDEN);
  }
};
