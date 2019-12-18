const { Users } = require('../models');
const { Tokens } = require('../models');
const { WorkerSpecialization } = require('../models');
const { Balances } = require('../models');
const { userStatus } = require('../customType');
const { identityType } = require('../customType');
const { Identities } = require('../models');
const uuidv = require('uuid/v4');
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
  addWorkerSpec(id, spec, price) {
    if (!id) {
      throw badRequest({ id: 'Missing data' });
    }
    if (!spec) {
      throw badRequest({ spec: 'Missing data' });
    }

    return WorkerSpecialization
      .create({
        userId: id,
        productTypeId: spec,
        price,
      });
  },
  readWorkerSpec(id) {
    if (!id) {
      throw badRequest({ id: 'Missing data' });
    }

    return WorkerSpecialization
      .findAll({ where: { userId: id } });
  },
  removeWorkerSpec(id) {
    if (!id) {
      throw badRequest({ id: 'Specialization does not exist' });
    }

    return WorkerSpecialization
      .destroy({ where: { id } });
  },
  updateWorkerSpec(id, price, hidden) {
    if (!id) {
      throw badRequest({ id: 'Specialization does not exist' });
    }

    return WorkerSpecialization
      .update(
        { price, hidden },
        { where: { id } },
      );
  },
  changeStatus(id) {
    if (!id) {
      throw badRequest({ id: 'User does not exist' });
    }

    return Users
      .update(
        { status: userStatus.worker },
        { where: { id } },
      )
      .then(() => {
        Balances
          .create({
            userId: id,
            balance: 0,
          });
      });
  },
  addIdentity(userId, type, photos) {
    if (!userId) {
      throw badRequest({ userId: 'User does not exist' });
    }
    if (!type) {
      throw badRequest({ type: 'Missing data' });
    }

    return Identities
      .create({
        userId,
        type: identityType[type],
        frontPhoto: photos.frontPhoto,
        backPhoto: photos.backPhoto,
        photo: photos.photo,
        certificatePhotos: photos.certificatePhotos,
      });
  },
  async registration(body) {
    const confirmationCode = uuidv();

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
  deleteNumber(phoneNumber) {
    if (!phoneNumber) {
      throw badRequest({ user: 'Phone number not found' });
    }

    return Users
      .update(
        { phoneNumber: null },
        { where: { phoneNumber } },
      );
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
