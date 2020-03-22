'use strict';

const TOKEN_LENGTH = 20000;

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Tokens', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    userId: {
      allowNull: false,
      type: Sequelize.BIGINT,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    authToken: { type: Sequelize.STRING(TOKEN_LENGTH) },
    refreshToken: { type: Sequelize.STRING(TOKEN_LENGTH) },
    createdAt: {},
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Tokens'),
};
