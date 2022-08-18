//imports
import { Router } from 'express';
const router = Router();

//Controllers imports
const foodsController = require('../controllers/nutritionControllers/foodsController');
const recipesController = require('../controllers/nutritionControllers/recipesController');
const dietsController = require('../controllers/nutritionControllers/dietsController');
const chronicConditionsController = require('../controllers/nutritionControllers/chronicConditionsController');
const menstrualCyclePhasesController = require('../controllers/general/menstrualCyclePhasesController');

/* FOOD */
//Render Views
router.get('/', foodsController.redirectToViewSelectFood); //defeault render for '/nutrition'
router.get('/food', foodsController.getViewToSelectFood);
router.get('/food/:foodId', foodsController.getViewOfSelectedFood);
router.get('/add-food', foodsController.getViewToAddFood);
//Actions
router.post('/add-food', foodsController.addFood);
router.post('/update-food/:foodId', foodsController.updateFood);
router.post('/redirect-to-view-selected-food', foodsController.redirectToViewSelectedFood);
//APIs
router.delete('/food/:foodId', foodsController.apiDeleteFood);


/* RECIPE */
router.get('/recipe', recipesController.getRecipe);
router.get('/add-recipe', recipesController.getAddRecipe);
router.post('/recipe', recipesController.addRecipe);

/* DIET */
//Renders
router.get('/diet', dietsController.getDiet);
router.get('/add-diet', dietsController.getAddDiet);
router.post('/diet', dietsController.addDiet);
//APIs
router.get('/diets', dietsController.apiGetDiets);

/* CHRONIC CONDITION */
//Renders
router.get('/chronicCondition', chronicConditionsController.getChronicConditions);
router.get('/add-chronicCondition', chronicConditionsController.getAddChronicConditions);
router.post('/chronicCondition', chronicConditionsController.addChronicCondition);
//APIs
router.get('/chronicConditions', chronicConditionsController.apiGetChronicConditions);

/* MENSTRUAL CYCLE PHASES */
//APIs
router.get('/menstrualCyclePhases', menstrualCyclePhasesController.apiGetPhases);

//exports
export default router;
