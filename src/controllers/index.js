const { Users } = require('../models');
const HttpStatus = require('http-status-codes');
const HttpError = require('./http-error');

module.exports = {
  list(req, res) {
    return Users
      .findAll({ order: [['id']] })
      .then(users => res.status(HttpStatus.OK).send(users))
      .catch(() => {
        throw HttpError.badRequest('Users do not exist');
      });
  },
};
