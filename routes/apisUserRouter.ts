import express from 'express';
import * as userController from '../controllers/userControllers/userInfoController';

const router = express.Router();

router.get('/currentUser', userController.getCurrentUser);

export default router;