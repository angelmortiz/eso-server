const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

//Sign-Up
router.post('/signup', authController.signup);

export default router;