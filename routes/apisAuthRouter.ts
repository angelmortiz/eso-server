const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

//Sign-Up
router.post('/signup', authController.signup);

//Log in
router.post('/login', authController.login);

//Forgot password
router.post('/forgotPassword', authController.forgotPassword);

//Reset password
router.patch('/resetPassword', authController.resetPassword);
export default router;