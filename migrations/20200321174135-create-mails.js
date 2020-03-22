const { mailStatus } = require('../src/customType');

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
      type: Sequelize.ENUM(Object.keys(mailStatus)),
      defaultValue: mailStatus.active,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    email: Sequelize.STRING,
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
