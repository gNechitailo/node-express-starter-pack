const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');
const { refreshTokenLifetimeDays } = require('../config');

class Token extends Model {
  static makeTokenPair(userId) {
    const tokenInfo = { userId, now: new Date().toISOString() };

    const authToken = jwt.sign(
      tokenInfo,
      'nodeauthsecret', { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      tokenInfo,
      'nodeauthsecret', { expiresIn: `${refreshTokenLifetimeDays}d` },
    );

    return Token
      .create({
        userId,
        authToken,
        refreshToken,
      });
  }

  toDTO() {
    return {
      authToken: this.authToken,
      refreshToken: this.refreshToken,
    };
  }
}

module.exports = (sequelize, DataTypes) => {
  Token.init({
    userId: DataTypes.BIGINT,
    authToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
  }, {
    timestamps: true,
    sequelize,
  });

  Token.associate = function(models) {
    Token.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Token;
};
