const userService = require('../services/userService');
const mailService = require('../services/mailService');
const HttpStatus = require('http-status-codes');
const makeError = require('./http-error');
const { wrapController } = require('../helpers/catchError');
const { badRequest, unprocessableEntity } = makeError;

const validateEmail = (email) => {
  const re = /^[-!#$%&'*+/\w=?^_{|}~](\.?[-!#$%&'*+/\w=?^_{|}~])*@\w(-?\w)*(\.[a-zA-Z](-?\w)*)+$/u;

  return re.test(email);
};

// eslint-disable-next-line no-magic-numbers
const validatePass = (password) => password.length >= 8;

function MakeUserController() {
  const controller = {
    getUser(req, res) {
      res.status(HttpStatus.OK).json(req.user.toDTO());
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
      if (Object.keys(error).length) {
        throw unprocessableEntity(error);
      }
      if (!validateEmail(body.email)) {
        throw badRequest({ email: 'Please enter correct email' });
      }
      if (!validatePass(body.password)) {
        throw badRequest({ password: 'Please enter valid password' });
      }

      const createdUser = await userService.register(body);

      await mailService.mailCreate(createdUser.id, 'activateAccount', {
        confirmationCode: createdUser.confirmationCode,
      });

      res.sendStatus(HttpStatus.CREATED);
    },

    async confirmEmail(req, res) {
      const { code } = req.params;
      await userService.confirmEmail(code);

      res.sendStatus(HttpStatus.OK);
    },

    async requestNewPassword(req, res) {
      const { email } = req.body;

      if (!email) {
        throw badRequest({ email: 'Please enter correct email' });
      }

      const { id: userId, passwordResetCode } = await userService.requestNewPassword(email);
      await mailService.mailCreate(userId, 'resetPassword', { passwordResetCode });

      res.sendStatus(HttpStatus.ACCEPTED);
    },

    async resetPassword(req, res) {
      const { password, code } = req.body;

      if (!password || !validatePass(password)) {
        throw badRequest({ password: 'Please enter a password at least 8 characters long' });
      }

      await userService.resetPasswordByCode(code, password);
      res.sendStatus(HttpStatus.ACCEPTED);
    },

    async updateUserDetails(req, res) {
      const { user } = req;
      const updateFields = req.body;

      const updatedUser = await userService.updateUserDetails(user, updateFields);

      res.status(HttpStatus.OK).json(updatedUser.toDTO());
    },

    async updatePassword(req, res) {
      const { user } = req;
      const { passwordOld, password } = req.body;

      if (!passwordOld) {
        throw badRequest({ user: 'Enter your old password' });
      }

      if (!password) {
        throw badRequest({ user: 'Enter your new password' });
      }

      await userService.updatePassword(user, passwordOld, password);

      res.sendStatus(HttpStatus.OK);
    },
  };

  wrapController(controller);

  return controller;
}

module.exports = MakeUserController;
