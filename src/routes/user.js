const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const { wrapController } = require('../helpers/catchError');
const ctrl = wrapController(userController);

router.get('/:token', ctrl.getUser);
router.get('/confirm/:code', ctrl.confirmEmail);
router.post('/reset-pass', ctrl.resetPassword);
router.post('/send', ctrl.requestNewPassword);
router.post('/signup', ctrl.register);
router.put('/update-info', ctrl.updateUserDetails);
router.delete('/delete-num', ctrl.deleteNumber);
router.post('/check-pass', ctrl.checkPassword);
router.post('/update-pass', ctrl.updatePassword);
router.post('/update-notification-settings', ctrl.updateNotificationSettings);

module.exports = router;
