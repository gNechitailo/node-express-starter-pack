const express = require('express');
const jwtCheck = require('../middleware/jwtcheck');

function makeUserRouter({ userController }) {
  const router = new express.Router();

  router.post('/register', userController.register);
  router.get('/confirm/:code', userController.confirmEmail);
  router.post('/request-password-reset', userController.requestNewPassword);
  router.post('/password-reset', userController.resetPassword);

  router.post('/update-pass', jwtCheck, userController.updatePassword);
  router.get('/', jwtCheck, userController.getUser);
  router.put('/', jwtCheck, userController.updateUserDetails);

  return router;
}

module.exports = makeUserRouter;
