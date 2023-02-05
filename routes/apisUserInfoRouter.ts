import express from 'express';
import * as userController from '../controllers/userControllers/userInfoController';

const router = express.Router();

router.get('/', userController.apiGetUserInfo);
router.get('/:userId', userController.apiGetUserInfoById);
router.post('/', userController.apiAddUserInfo);
router.put('/:userId', userController.apiUpdateUserInfo);
router.delete('/:userId', userController.apiDeleteUserInfo);

export default router;