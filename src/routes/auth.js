const express = require('express');
const router = new express.Router();
const makeAuthController = require('../controllers/auth');

const authController = new makeAuthController();

router.post('/login', authController.handleLogin);
router.post('/refresh-token', authController.handleRefreshToken);
router.delete('/logout', authController.handleLogout);

module.exports = router;
