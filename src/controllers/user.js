const { Users } = require('../models');
const uuidv = require('uuid/v4');
const userService = require('../services/userService');
const { mailCreate } = require('../services/mailService');
const HttpStatus = require('http-status-codes');
const makeError = require('./http-error');

const badRequest = makeError.bind(HttpStatus.BAD_REQUEST);
const unprocessableEntity = makeError.bind(HttpStatus.UNPROCESSABLE_ENTITY);

const validateEmail = email => {
  const re = /^[-!#$%&'*+/\w=?^_{|}~](\.?[-!#$%&'*+/\w=?^_{|}~])*@\w(-?\w)*(\.[a-zA-Z](-?\w)*)+$/u;

  return re.test(email);
};

const validatePass = password => {
  const re = /.{8,}/gu;

  return re.test(password);
};

module.exports = {
  async confirmEmail(req, res) {
    await userService.confirmEmail(req.params.code);

    res.status(HttpStatus.OK).send();
  },
  async resetPassword(req, res) {
    let userIWillFind;

    if (!req.body.password) {
      throw badRequest({ password: 'Please enter correct password' });
    }
    if (!validatePass(req.body.password)) {
      throw badRequest({ password: 'You password much be at least 8 characters long' });
    }

    await Users
      .findOne({ where: { passwordResetCode: req.body.code } })
      .then(user => user.update({ passwordResetCode: null }))
      .then(user => {
        userIWillFind = user;

        return user.hashPassword(req.body.password);
      })
      .then(() => {
        userIWillFind.save();
      })
      .catch(() => {
        throw badRequest({ resetCode: 'Invalid reset code' });
      })
      .then(() => res.status(HttpStatus.ACCEPTED).send());
  },
  async requestNewPassword(req, res) {
    const resetCode = uuidv();

    if (!req.body.email) {
      throw badRequest({ email: 'Please enter correct email' });
    }

    const user = await Users.findOne({ where: { email: req.body.email } });

    if (!user) {
      throw unprocessableEntity({ user: 'User is not registered' });
    }

    await Promise.all([
      user.update({ passwordResetCode: resetCode }),
      mailCreate(user.id, 'resetPassword', { passwordResetCode: resetCode }),
    ]);
    res.status(HttpStatus.ACCEPTED).send();
  },
  async register(req, res) {
    const { body } = req;
    const error = {};

    if (!body.firstName) {
      error.firstName = 'Please enter correct first name';
    }
    if (!body.lastName) {
      error.lastName = 'Please enter correct last name';
    }
    if (!body.email) {
      error.email = 'Please enter correct email';
    }
    if (!body.password) {
      error.password = 'Please enter correct password';
    }
    if (!body.zip) {
      error.zip = 'Please enter your zip code';
    }
    if (Object.keys(error).length) {
      throw unprocessableEntity(error);
    }
    if (!validateEmail(body.email)) {
      throw badRequest({ email: 'Please enter correct email' });
    }
    if (!validatePass(body.password)) {
      throw badRequest({ password: 'You password much be at least 8 characters long' });
    }


    await userService.registration(body);

    res.status(HttpStatus.CREATED).send();
  },
  async updateUserDetails(req, res) {
    const { body: { id, about, phoneNumber } } = req;

    if (!id) {
      throw badRequest({ user: 'User not found' });
    }

    const user = await userService.updateUserDetails(id, { about, phoneNumber });

    res.status(HttpStatus.OK).send(user);
  },
  async getUser(req, res) {
    const info = await userService.getUser(req.params.token);

    res.status(HttpStatus.OK).send({
      id: info.user.id,
      firstName: info.user.firstName,
      lastName: info.user.lastName,
      zip: info.user.zip,
      email: info.user.email,
      verified: info.user.verified,
    });
  },
  async deleteNumber(req, res) {
    await userService.deleteNumber(req.params.phoneNumber);

    res.status(HttpStatus.OK).send();
  },
  async checkPassword(req, res) {
    const { body: { email, password } } = req;

    if (!email) {
      throw badRequest({ user: 'User not found' });
    }

    await userService.checkPassword(email, password);

    res.status(HttpStatus.OK).send();
  },
  async updatePassword(req, res) {
    const { body: { email, passwordOld, password } } = req;

    if (!email) {
      throw badRequest({ user: 'User not found' });
    }

    await userService.updatePassword(email, passwordOld, password);

    res.status(HttpStatus.OK).send();
  },
  async updateNotificationSettings(req, res) {
    const {
      body: {
        id,
        notificationsMessages,
        notificationsJobs,
        notificationsRequests,
        notifyEmail,
        notifyPush,
      },
    } = req;

    if (!id) {
      throw badRequest({ user: 'User not found' });
    }

    await userService.updateNotificationSettings(
      id,
      notificationsMessages,
      notificationsJobs,
      notificationsRequests,
      notifyEmail,
      notifyPush,
    );

    res.status(HttpStatus.OK).send();
  },
};
