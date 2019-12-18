const express = require('express');
const router = new express.Router();
const authController = require('../controllers/auth');
const { wrapController } = require('../helpers/catchError');
const ctrl = wrapController(authController);

router.post('/login', ctrl.login);
router.delete('/logout/:token', ctrl.logout);

module.exports = router;
