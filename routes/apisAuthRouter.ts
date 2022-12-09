const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

//Sign-Up
router.post('/signup', authController.signup);

//Log in
router.post('/login', authController.login);

export default router;