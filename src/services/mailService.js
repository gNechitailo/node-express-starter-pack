const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const { Mail, User } = require('../models');
const config = require('../config');
const makeEmail = require('../mails/index');
const { operationStatus } = require('../customType');
const debug = require('debug')('MyApp:emailService');

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

  if (mailTasks.length) {
    debug(`Sending mails, ${mailTasks.length} to be sent`);
  } else {
    debug(`No mails to be sent`);
  }

  const successful = [];
  const failed = [];
  const promises = mailTasks.map(async(mailTask) => {
    try {
      const { html, subject } = makeEmail(mailTask.templateName, mailTask.user);

      const receiver = mailTask.email || mailTask.user.email;
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

const mailCreate = (userId, templateName, additionalInfo) => Mail.create({
  userId,
  templateName,
  additionalInfo,
});

module.exports = { sendMail, mailCreate };
