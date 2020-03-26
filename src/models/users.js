const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const EditableFields = [
  'firstName',
  'lastName',
  'phoneNumber',
  'photo',
  'zip',
  'location',
  'about',
];

const DtoFields = [
  'id',
  'email',
  ...EditableFields,
];

class User extends Model {
  async hashPassword(password) {
    this.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return this.passwordHash;
  }

  toDTO() {
    return User.toDTO(this);
  }

  static toDTO(sourceObject) {
    return DtoFields.reduce((result, key) => {
      result[key] = sourceObject[key];

      return result;
    }, {});
  }

  static editableFields(sourceObject) {
    return EditableFields.reduce((result, key) => {
      if (typeof sourceObject[key] !== 'undefined') {
        result[key] = sourceObject[key];
      }

      return result;
    }, {});
  }

  // WARNING: this function returns Promise
  comparePassword(password) {
    try {
      return bcrypt.compare(password, this.passwordHash);
    } catch (error) {
      return Promise.reject();
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
