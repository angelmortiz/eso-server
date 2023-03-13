import { Router } from 'express';
const router = Router();

import * as homePageController from '../controllers/homePageControllers/homePageController';

router.get('/', homePageController.apiGetHomePage);
router.get('/favico.ico', homePageController.apiGetHomePage);

//exports
export default router;
