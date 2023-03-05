import { Router } from 'express';
const router = Router();

import * as homePageController from '../controllers/homePageControllers/homePageController';

router.get('/', homePageController.apiGetHomePage);

//exports
export default router;
