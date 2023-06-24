import express from 'express';
import passport from 'passport';
import * as userAuthController from '../controllers/userControllers/userAuthController';

const router = express.Router();

//Sign-Up
router.post('/signup', userAuthController.signup);

//Log in using local JWT
router.post('/login', userAuthController.login);

//Log in using Google
router.get('/login/google', userAuthController.loginWithGoogle);
//Log in using Google Callback
router.get(
  '/login/google/callback',
  userAuthController.loginWithGoogleFailureRedirect,
  userAuthController.loginWithGoogleSuccessRedirect
);

//Log in using Facebook
router.get('/login/facebook', userAuthController.loginWithFacebook);
//Log in using Facebook Callback
router.get(
  '/login/facebook/callback',
  userAuthController.loginWithFacebookFailureRedirect,
  userAuthController.loginWithFacebookSuccessRedirect
);

//Log out
router.post('/logout', userAuthController.logout);

//Forgot password
router.post('/forgotPassword', userAuthController.forgotPassword);

//Reset password
router.patch('/resetPassword', userAuthController.resetPassword);

//Change password
router.post(
  '/changePassword',
  userAuthController.protectRoute,
  userAuthController.changePassword
);

//Check user authentication
router.post('/isAuthenticationValid', userAuthController.isAuthenticationValid);

export default router;
