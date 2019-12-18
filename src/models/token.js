'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tokens = sequelize.define('Tokens', {
    userId: DataTypes.BIGINT,
    authToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
  }, { timestamps: false });

  Tokens.associate = function(models) {
    Tokens.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Tokens;
};
