const { Users } = require('../models');
const { Tokens } = require('../models');
const uuid = require('uuid/v4');
const { mailCreate } = require('../services/mailService');
const HttpStatus = require('http-status-codes');
const makeError = require('../controllers/http-error');

const badRequest = makeError.bind(HttpStatus.BAD_REQUEST);
const unauthorized = makeError.bind(HttpStatus.UNAUTHORIZED);
const unprocessableEntity = makeError.bind(HttpStatus.UNPROCESSABLE_ENTITY);

module.exports = {
  updateUserDetails(id, info) {
    return Users
      .findOne({ where: { id } })
      .then(user => user.update({
        about: info.about,
        phoneNumber: info.phoneNumber,
      }));
  },
  confirmEmail(code) {
    if (!code) {
      throw badRequest({ confirmationCode: 'Invalid confirmation code' });
    }

    return Users
      .findOne({ where: { confirmationCode: code } })
      .then(userCode => userCode.update({ confirmationCode: null }));
  },
  async registration(body) {
    const confirmationCode = uuid();

    body.confirmationCode = confirmationCode;
    const existingUser = await Users.findOne({ where: { email: body.email } });

    if (existingUser) {
      throw unauthorized({ email: 'Registration failed. Email address already in use' });
    }

    const user = Users.build(body);

    await user.hashPassword(body.password);
    await user.save();

    await mailCreate(user.id, 'activateAccount', { confirmationCode });
  },
  getUser(authToken) {
    if (!authToken) {
      throw badRequest({ token: 'Token not found' });
    }

    return Tokens
      .findOne({
        where: { authToken },
        include: [
          {
            model: Users,
            as: 'user',
          },
        ],
      });
  },
  async checkPassword(email, password) {
    if (!email || !password) {
      throw unprocessableEntity({});
    }

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      throw unprocessableEntity();
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw unprocessableEntity();
    }
  },
  async updatePassword(email, passwordOld, password) {
    if (!email || !password || !passwordOld) {
      throw unprocessableEntity({});
    }

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      throw unprocessableEntity();
    }

    const isMatch = await user.comparePassword(passwordOld);

    if (!isMatch) {
      throw unprocessableEntity();
    }

    await user.hashPassword(password);
    await user.save();
  },
  updateNotificationSettings(
    id,
    notificationsMessages,
    notificationsJobs,
    notificationsRequests,
    notifyEmail,
    notifyPush,
  ) {
    return Users
      .update(
        { notificationsMessages, notificationsJobs, notificationsRequests, notifyEmail, notifyPush },
        { where: { id } },
      );
  },
};
