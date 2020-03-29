const express = require('express');
const router = new express.Router();

function makeAuthRouter({ authController }) {
  router.post('/login', authController.handleLogin);
  router.post('/refresh-token', authController.handleRefreshToken);
  router.delete('/logout', authController.handleLogout);

  return router;
}

module.exports = makeAuthRouter;
