const { User } = require('../models');
const uuid = require('uuid/v4');
const {
  badRequest,
  unprocessableEntity,
  notFound,
} = require('../controllers/http-error');

module.exports = {
  async register(userInfo) {
    userInfo.confirmationCode = uuid();
    const existingUser = await User.findOne({ where: { email: userInfo.email } });

    if (existingUser) {
      throw badRequest({ email: 'Registration failed. Email address already in use' });
    }

    const user = User.build(userInfo);

    await user.hashPassword(userInfo.password);
    await user.save();

    return user;
  },
  async confirmEmail(code) {
    if (!code) {
      throw badRequest({ confirmationCode: 'No confirmation code provided' });
    }

    const [ affectedRowsNum ] = await User.update({
      confirmationCode: null,
    }, {
      where: { confirmationCode: code },
    });

    if (affectedRowsNum === 0) {
      throw notFound({ confirmationCode: 'The code is either outdated or incorrect' });
    }
  },

  async requestNewPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw notFound({ email: 'User with such email is not registered' });
    }

    user.passwordResetCode = uuid();
    await user.save();

    return user;
  },

  async resetPasswordByCode(code, password) {
    const userToUpdate = await User
      .findOne({ where: { passwordResetCode: code } });

    if (!userToUpdate) {
      throw notFound({ resetCode: 'Reset code is not found' });
    }

    await userToUpdate.hashPassword(password);
    userToUpdate.passwordResetCode = null;
    await userToUpdate.save();
  },

  async updateUserDetails(originalUser, update) {
    const updatableFields = User.editableFields(update);
    const resultUser = Object.assign(originalUser, updatableFields);

    await resultUser.save();

    return resultUser;
  },

  getUserById(id) {
    return User.findByPk(parseInt(id));
  },

  async updatePassword(user, passwordOld, password) {
    const match = await user.comparePassword(passwordOld);

    if (!match) {
      throw unprocessableEntity({ passwordOld: 'Provided password is incorrect' });
    }

    await user.hashPassword(password);
    await user.save();
  },
};
