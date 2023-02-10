import express from 'express';
import { restrictAccessTo } from '../controllers/userControllers/userAuthController';
import * as userController from '../controllers/userControllers/userInfoController';

const router = express.Router();

router.get('/', restrictAccessTo('Admin'),userController.apiGetAllUsers);
router.get('/user', userController.apiGetUserInfo);
router.get('/user/:userId', userController.apiGetUserInfoById);
/** Deactivated routes  */
// router.post('/user', userController.apiAddUserInfo);
// router.put('/user/:userId', userController.apiUpdateUserInfo);
// router.delete('/user/:userId', userController.apiDeleteUserInfo);

export default router;