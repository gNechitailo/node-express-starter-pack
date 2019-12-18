const { Mails } = require('../models');
const { promisify } = require('util');
const debug = require('debug')('MyApp:emailService');
const nodemailer = require('nodemailer');
const config = require('../config/config');

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

const sendMail = () => {
  debug('Sending email');
  sendLetter('Hello', '<div></div>', 'a@a.a');
};

const mailCreate = (userId, template, additionalInfo) => {
  Mails.create({
    userId,
    template,
    additionalInfo,
  });
};

module.exports = { sendMail, mailCreate };
