const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const { Tokens } = require('../models');
const debug = require('debug')('MyApp:auth-service');
const HttpStatus = require('http-status-codes');
const makeError = require('../controllers/http-error');

const unprocessableEntity = makeError.bind(HttpStatus.UNPROCESSABLE_ENTITY);
const badRequest = makeError.bind(HttpStatus.BAD_REQUEST);

module.exports = {
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      throw unprocessableEntity({});
    }
    const user = await Users.findOne({ where: { email: req.body.email } });

    if (!user) {
      throw unprocessableEntity({ email: `Email ${req.body.email} is not registered in MyApp.` });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      throw unprocessableEntity();
    }

    if (user.confirmationCode) {
      throw unprocessableEntity();
    }

    const tokenInfo = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = jwt.sign(
      tokenInfo,
      'nodeauthsecret', { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      tokenInfo,
      'nodeauthsecret', { expiresIn: '30d' },
    );

    jwt.verify(token, 'nodeauthsecret', (error, data) => {
      debug(error, data);
    });

    await Tokens
      .destroy({ where: { userId: user.id } });

    await Tokens
      .create({
        userId: user.id,
        authToken: token,
        refreshToken,
      });

    res.json({
      success: true,
      token,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      zip: user.zip,
      email: user.email,
      verified: user.verified,
    });
  },
  logout(authToken) {
    if (!authToken) {
      throw badRequest({ token: 'Token does not exist' });
    }

    return Tokens
      .destroy({ where: { authToken } });
  },
};
