'use strict';

const { userStatus } = require('../customType');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const asyncCompare = promisify(bcrypt.compare);
const BCRYPTVAL = 10;

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    zip: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    location: DataTypes.STRING,
    about: DataTypes.STRING,
    status: DataTypes.ENUM(Object.keys(userStatus)),
    confirmationCode: DataTypes.UUID,
    passwordResetCode: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    verified: DataTypes.BOOLEAN,
    notificationsMessages: DataTypes.BOOLEAN,
    notificationsJobs: DataTypes.BOOLEAN,
    notificationsRequests: DataTypes.BOOLEAN,
    notifyEmail: DataTypes.BOOLEAN,
    notifyPush: DataTypes.BOOLEAN,
  }, { timestamps: false });

  Users.prototype.hashPassword = async function(password) {
    this.passwordHash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, BCRYPTVAL, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    })
  };

  Users.prototype.comparePassword = function(password) {
    return asyncCompare(password, this.passwordHash).catch(() => false);
  };

  return Users;
};
