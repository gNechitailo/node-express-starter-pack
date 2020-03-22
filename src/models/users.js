const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

class User extends Model {
  static async hashPassword(password) {
    this.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return this.passwordHash;
  }

  comparePassword(password) {
    try {
      return bcrypt.compare(password, this.passwordHash);
    } catch (error) {
      return false;
    }
  }
}

module.exports = (sequelize, DataTypes) => {
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    zip: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    location: DataTypes.STRING,
    about: DataTypes.STRING,
    confirmationCode: DataTypes.UUID,
    passwordResetCode: DataTypes.UUID,
  }, {
    timestamps: true,
    paranoid: true,
    sequelize,
  });

  return User;
};
