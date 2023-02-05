import express from 'express';
import * as userAuthController from '../controllers/userControllers/userAuthController';

const router = express.Router();

//Sign-Up
router.post('/signup', userAuthController.signup);

//Log in
router.post('/login', userAuthController.login);

//Log out
router.post('/logout', userAuthController.logout);

//Forgot password
router.post('/forgotPassword', userAuthController.forgotPassword);

//Reset password
router.patch('/resetPassword', userAuthController.resetPassword);

//Change password
router.post('/changePassword', userAuthController.protectRoute, userAuthController.changePassword);

//Check user authentication
router.post('/isAuthenticationValid', userAuthController.isAuthenticationValid);

export default router;