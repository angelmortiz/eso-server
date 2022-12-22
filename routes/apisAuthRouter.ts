import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

//Sign-Up
router.post('/signup', authController.signup);

//Log in
router.post('/login', authController.login);

//Log out
router.post('/logout', authController.logout);

//Forgot password
router.post('/forgotPassword', authController.forgotPassword);

//Reset password
router.patch('/resetPassword', authController.resetPassword);

//Change password
router.post('/changePassword', authController.protectRoute, authController.changePassword);

export default router;