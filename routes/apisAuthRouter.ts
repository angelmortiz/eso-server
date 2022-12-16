import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

//Sign-Up
router.post('/signup', authController.signup);

//Log in
router.post('/login', authController.login);

//Change password
router.post('/changePassword', authController.protectRoute, authController.changePassword);

//Forgot password
router.post('/forgotPassword', authController.forgotPassword);

//Reset password
router.patch('/resetPassword/:resetToken', authController.resetPassword);

export default router;