const { operationStatus } = require('../src/customType');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Mails', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    templateName: { type: Sequelize.STRING },
    subject: { type: Sequelize.STRING },
    status: {
      type: Sequelize.ENUM(Object.keys(operationStatus)),
      defaultValue: operationStatus.active,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    email: Sequelize.STRING,
    additionalInfo: {
      type: Sequelize.JSON,
      defaultValue: {},
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Mails'),
};
