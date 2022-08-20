//imports
import { Router } from 'express';
const router = Router();

//Controllers imports
import * as foodsController from '../controllers/nutritionControllers/foodsController';
import * as recipesController from '../controllers/nutritionControllers/recipesController';
import * as dietsController from '../controllers/nutritionControllers/dietsController';
import * as chronicConditionsController from '../controllers/nutritionControllers/chronicConditionsController';
import * as menstrualCyclePhasesController from '../controllers/general/menstrualCyclePhasesController';

/* FOOD */
//Render Views
router.get('/', foodsController.redirectToViewAddFood); //defeault render for '/nutrition'
router.get('/food', foodsController.redirectToViewAddFood);
router.get('/food/:foodId', foodsController.getViewOfSelectedFood);
router.get('/add-food', foodsController.getViewToAddFood);
//Actions
router.post('/add-food', foodsController.addFood);
router.post('/update-food/:foodId', foodsController.updateFood);
router.post('/redirect-to-view-selected-food', foodsController.redirectToViewSelectedFood);
//APIs
router.get('/foods', foodsController.apiGetFoods);
router.delete('/food/:foodId', foodsController.apiDeleteFood);

/* RECIPE */
//Render Views
router.get('/recipe', recipesController.redirectToViewAddRecipe);
router.get('/recipe/:recipeId', recipesController.getViewOfSelectedRecipe);
router.get('/add-recipe', recipesController.getViewToAddRecipe);
//Actions
router.post('/add-recipe', recipesController.addRecipe);
router.post('/update-recipe/:recipeId', recipesController.updateRecipe);
router.post('/redirect-to-view-selected-recipe', recipesController.redirectToViewSelectedRecipe);
//APIs
router.delete('/recipe/:recipeId', recipesController.apiDeleteRecipe);

/* DIET */
//Renders
router.get('/diet', dietsController.getViewToAddDiet);
router.get('/diet/:dietId', dietsController.getViewOfSelectedDiet);
router.get('/add-diet', dietsController.getViewToAddDiet);
//ACTIONS
router.post('/diet', dietsController.addDiet);
router.post('/update-diet/:dietId', dietsController.updateDiet);
router.post('/redirect-to-view-selected-diet', dietsController.redirectToViewSelectedDiet);
//APIs
router.get('/diets', dietsController.apiGetDiets);
router.delete('/diet/:dietId', dietsController.apiDeleteDiet);

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
