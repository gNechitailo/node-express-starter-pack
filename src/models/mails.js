const { Model } = require('sequelize');
const { operationStatus } = require('../customType');

class Mail extends Model {}

module.exports = (sequelize, DataTypes) => {
  Mail.init({
    templateName: DataTypes.STRING,
    subject: DataTypes.STRING,
    status: DataTypes.ENUM(Object.keys(operationStatus)),
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING,
  }, { sequelize });

  Mail.associate = function(models) {
    Mail.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Mail;
};
