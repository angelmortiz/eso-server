//imports
import { Router } from 'express';
const router = Router();

//Controllers imports
import * as foodController from '../controllers/nutritionControllers/foodsController';
import * as recipesController from '../controllers/nutritionControllers/recipesController';
import * as dietsController from '../controllers/nutritionControllers/dietsController';
import * as chronicConditionsController from '../controllers/nutritionControllers/chronicConditionsController';
import * as menstrualCyclePhasesController from '../controllers/general/menstrualCyclePhasesController';

/* FOOD */
//Render Views
router.get('/', foodController.redirectToViewAddFood); //defeault render for '/nutrition'
router.get('/food', foodController.redirectToViewAddFood);
router.get('/food/:foodId', foodController.getViewOfSelectedFood);
router.get('/add-food', foodController.getViewToAddFood);
//Actions
router.post('/add-food', foodController.addFood);
router.post('/update-food/:foodId', foodController.updateFood);
router.post('/redirect-to-view-selected-food', foodController.redirectToViewSelectedFood);
//APIs
router.delete('/food/:foodId', foodController.apiDeleteFood);


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
router.get('/chronicCondition', chronicConditionsController.getViewToAddChronicCondition);
router.get('/chronicCondition/:conditionId', chronicConditionsController.getViewToSelectedChronicCondition);
router.get('/add-chronicCondition', chronicConditionsController.getViewToAddChronicCondition);
//Actions
router.post('/chronicCondition', chronicConditionsController.addChronicCondition);
router.post('/update-chronicCondition/:chronicConditionId', chronicConditionsController.updateChronicCondition);
router.post('/redirect-to-view-selected-chronicCondition', chronicConditionsController.redirectToViewSelectedChronicCondition);
//APIs
router.get('/chronicConditions', chronicConditionsController.apiGetChronicConditions);
router.delete('/chronicCondition/:chronicConditionId', chronicConditionsController.apiDeleteChronicCondition);

/* MENSTRUAL CYCLE PHASES */
//APIs
router.get('/menstrualCyclePhases', menstrualCyclePhasesController.apiGetPhases);

//exports
export default router;
