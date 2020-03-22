const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const { Mail, User } = require('../models');
const debug = require('debug')('MyApp:emailService');
const config = require('../config');
const makeEmail = require('../emails/index');
const { operationStatus } = require('../customType');

// Example transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

const asyncSendMail = promisify(transporter.sendMail.bind(transporter));

const sendLetter = (subject, html, to) => {
  const mailOptions = {
    from: config.mailFrom,
    to,
    subject,
    html,
  };

  return asyncSendMail(mailOptions);
};

async function sendMail() {
  const mailTasks = await Mail.findAll({
    where: { status: 'active' },
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
  });

  debug(`Sending mails, ${mailTasks.length} to be sent`);

  const successful = [];
  const failed = [];
  const promises = mailTasks.map(async(mailTask) => {
    const { html, subject } = makeEmail(mailTask.template, mailTask.user);
    const receiver = mailTask.user.dataValues.userEmail;

    try {
      await sendLetter(subject, html, receiver);

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
    debug('Error during email update');
  }
}

const mailCreate = (userId, templateName, additionalInfo) => {
  return Mail.create({
    userId,
    templateName,
    additionalInfo,
  });
};

module.exports = { sendMail, mailCreate };
