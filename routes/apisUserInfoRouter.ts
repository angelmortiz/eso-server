import express from 'express';
import * as userController from '../controllers/userControllers/userInfoController';

const router = express.Router();

router.get('/', userController.apiGetAllUsers);
router.get('/user', userController.apiGetUserInfo);
router.get('/user/:userId', userController.apiGetUserInfoById);
router.post('/user', userController.apiAddUserInfo);
router.put('/user/:userId', userController.apiUpdateUserInfo);
router.delete('/user/:userId', userController.apiDeleteUserInfo);

export default router;