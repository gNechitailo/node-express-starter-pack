const authService = require('../services/authService');
const HttpStatus = require('http-status-codes');
const { wrapController } = require('../helpers/catchError');

function makeAuthController() {
  const controller = {
    async handleLogin(req, res) {
      const { email, password } = req.body;
      const userWithToken = await authService.login(email, password);

      res.status(HttpStatus.OK).json(userWithToken);
    },
    async handleLogout(req, res) {
      const { authorization } = req.headers;

      await authService.logout(authorization);

      res.sendStatus(HttpStatus.OK);
    },
    async handleRefreshToken(req, res) {
      const { refreshToken } = req.body;

      const newTokens = await authService.refreshAurhorization(refreshToken);

      res.status(HttpStatus.OK).json(newTokens);
    },
  };

  wrapController(controller);

  return controller;
}

module.exports = makeAuthController;
