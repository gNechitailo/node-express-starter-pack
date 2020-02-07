const authService = require('../services/authService');
const HttpStatus = require('http-status-codes');

module.exports = {
  login(req, res) {
    const { email, password } = req.body
    const userWithToken = authService.login(email, password);

    res.status(HttpStatus.OK).send(userWithToken);
  },
  async logout(req, res) {
    await authService.logout(req.params.token);

    res.status(HttpStatus.OK).send();
  },
};
