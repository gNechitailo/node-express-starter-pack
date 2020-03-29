const Sequelize = require('sequelize');
const { refreshTokenLifetimeDays } = require('../config');
const { unprocessableEntity, badRequest } = require('../controllers/http-error');

module.exports = function makeAuthService({ models }) {
  const { User, Token } = models;

  return {
    async login(email, password) {
      if (!email || !password) {
        throw unprocessableEntity();
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw unprocessableEntity({ email: `Email ${email} is not registered in MyApp.` });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw unprocessableEntity({ password: 'Email or password is incorrect' });
      }

      if (user.confirmationCode) {
        throw badRequest({ email: 'Confirm your account first' });
      }

      const tokens = await Token.makeTokenPair(user.id);

      return {
        user: user.toDTO(),
        tokens: tokens.toDTO(),
      };
    },
    logout(authToken) {
      return Token
        .destroy({ where: { authToken } });
    },
    async refreshAurhorization(refreshToken) {
      const token = await Token.findOne({ where: { refreshToken } });

      if (!token) {
        throw unprocessableEntity();
      }

      const newTokens = await Token.makeTokenPair(token.userId);

      await Token.destroy({ where: { refreshToken } });

      return newTokens.toDTO();
    },
    cleanOutdatedTokens() {
      const refreshExpiredCreationDate = new Date();
      refreshExpiredCreationDate.setDate(refreshExpiredCreationDate.getDate() - refreshTokenLifetimeDays - 1);

      Token.destroy({ where: { createdAt: { [Sequelize.Op.lt]: refreshExpiredCreationDate } } });
    },
  };
};
