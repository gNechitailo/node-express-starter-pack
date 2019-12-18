const authService = require('../services/authService');
const HttpStatus = require('http-status-codes');

module.exports = {
  login(req, res) {
    return authService.login(req, res);
  },
  async logout(req, res) {
    await authService.logout(req.params.token);

    res.status(HttpStatus.OK).send();
  },
};
