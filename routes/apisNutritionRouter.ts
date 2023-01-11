//imports
import { Router } from 'express';
const router = Router();

//Controllers imports
import * as foodsController from '../controllers/nutritionControllers/foodsController';
import * as recipesController from '../controllers/nutritionControllers/recipesController';
import * as dietsController from '../controllers/nutritionControllers/dietsController';
import * as chronicConditionsController from '../controllers/nutritionControllers/chronicConditionsController';
import * as menstrualCyclePhasesController from '../controllers/cycleControllers/menstrualCyclePhasesController';

/* FOOD */
//APIs
router.get('/foods', foodsController.apiGetFoods);
router.delete('/food/:foodId', foodsController.apiDeleteFood);

/* RECIPE */
//APIs
router.delete('/recipe/:recipeId', recipesController.apiDeleteRecipe);

/* DIET */
//APIs
router.get('/diets', dietsController.apiGetDiets);
router.delete('/diet/:dietId', dietsController.apiDeleteDiet);

/* CHRONIC CONDITION */
//APIs
router.get('/chronicConditions', chronicConditionsController.apiGetChronicConditions);
router.delete('/chronicCondition/:chronicConditionId', chronicConditionsController.apiDeleteChronicCondition);

/* MENSTRUAL CYCLE PHASES */
//APIs
router.get('/menstrualCyclePhases', menstrualCyclePhasesController.apiGetPhases);

//exports
export default router;
