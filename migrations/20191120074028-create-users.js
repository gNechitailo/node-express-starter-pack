'use strict';

const { userStatus } = require('../src/customType');

const TEXTCHAR = 20000;

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    passwordHash: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    zip: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    phoneNumber: { type: Sequelize.INTEGER },
    photo: { type: Sequelize.STRING },
    location: { type: Sequelize.STRING },
    about: { type: Sequelize.STRING(TEXTCHAR) },
    status: {
      type: Sequelize.ENUM(Object.keys(userStatus)),
      defaultValue: userStatus.regular,
    },
    confirmationCode: { type: Sequelize.STRING },
    passwordResetCode: { type: Sequelize.STRING },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    deletedAt: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
