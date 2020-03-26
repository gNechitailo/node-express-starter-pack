const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');
const { nodeAuthSecret, refreshTokenLifetimeDays } = require('../config');

class Token extends Model {
  static makeTokenPair(userId) {
    const tokenInfo = { userId, now: new Date().toISOString() };

    const authToken = jwt.sign(
      tokenInfo,
      nodeAuthSecret,
      { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      tokenInfo,
      nodeAuthSecret,
      { expiresIn: `${refreshTokenLifetimeDays}d` },
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
    updatedAt: false,
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
