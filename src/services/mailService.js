const Sequelize = require('sequelize');
const { promisify } = require('util');
const nodemailer = require('nodemailer');
const config = require('../config');
const makeLetter = require('../mails/index');
const { operationStatus } = require('../customType');
const debug = require('debug')('MyApp:emailService');

module.exports = function makeMailService({ mailTransporter, models }) {
  const { Mail, User } = models;

  const asyncSendLetter = promisify(mailTransporter.sendMail.bind(mailTransporter));

  const sendLetter = (mailTask) => {
    const { html, subject } = makeLetter(mailTask.templateName, mailTask.user);
    const receiverAddress = mailTask.email || mailTask.user.email;

    return asyncSendLetter({
      from: config.mailFrom,
      to: receiverAddress,
      subject,
      html,
    }).then((info) => {
      if (process.env.NODE_ENV === 'development') {
        debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    });
  };

  return {
    async sendMail() {
      const mailTasks = await Mail.findAll({
        where: { status: 'active' },
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      });

      if (mailTasks.length) {
        debug(`Sending mails, ${mailTasks.length} to be sent`);
      } else {
        debug(`No mails to be sent`);
      }

      const successful = [];
      const failed = [];
      const promises = mailTasks.map(async(mailTask) => {
        try {
          await sendLetter(mailTask);

          successful.push(mailTask.id);
        } catch (ex) {
          debug('Error during email sending', ex);
          failed.push(mailTask.id);
        }
      });

      await Promise.all(promises);

      try {
        await Promise.all([
          Mail.update(
            { status: operationStatus.fulfilled },
            { where: { id: { [Sequelize.Op.in]: successful } } },
          ),
          Mail.update(
            { status: operationStatus.rejected },
            { where: { id: { [Sequelize.Op.in]: failed } } },
          ),
        ]);
      } catch (error) {
        debug(`Error during email update ${error.message}`);
      }
    },
    mailCreate(userId, templateName, additionalInfo) {
      return Mail.create({
        userId,
        templateName,
        additionalInfo,
      });
    },
  };
};
