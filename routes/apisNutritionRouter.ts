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
router.get('/foodNames', foodsController.apiGetFoodNames);
router.get('/food/:foodId', foodsController.apiGetFoodById);
router.post('/food', foodsController.apiAddFood);
router.put('/food/:foodId', foodsController.apiUpdateFood);
router.delete('/food/:foodId', foodsController.apiDeleteFood);

/* RECIPE */
//APIs
router.get('/recipes', recipesController.apiGetRecipes);
router.get('/recipeNames', recipesController.apiGetRecipeNames);
router.get('/recipe/:recipeId', recipesController.apiGetRecipeById);
router.post('/recipe', recipesController.apiAddRecipe);
router.put('/recipe/:recipeId', recipesController.apiUpdateRecipe);
router.delete('/recipe/:recipeId', recipesController.apiDeleteRecipe);

/* DIET */
//APIs
router.get('/diets', dietsController.apiGetDiets);
router.get('/dietNames', dietsController.apiGetDietNames);
router.get('/diet/:dietId', dietsController.apiGetDietById);
router.post('/diet', dietsController.apiAddDiet);
router.put('/diet/:dietId', dietsController.apiUpdateDiet);
router.delete('/diet/:dietId', dietsController.apiDeleteDiet);

/* CHRONIC CONDITION */
//APIs
router.get('/chronicconditions', chronicConditionsController.apiGetChronicConditions);
router.get('/chronicconditionNames', chronicConditionsController.apiGetChronicConditionNames);
router.get('/chroniccondition/:chronicconditionId', chronicConditionsController.apiGetChronicConditionById);
router.post('/chroniccondition', chronicConditionsController.apiAddChronicCondition);
router.put('/chroniccondition/:chronicconditionId', chronicConditionsController.apiUpdateChronicCondition);
router.delete('/chroniccondition/:chronicconditionId', chronicConditionsController.apiDeleteChronicCondition);

/* MENSTRUAL CYCLE PHASES */
//APIs
router.get('/menstrualCyclePhases', menstrualCyclePhasesController.apiGetPhases);

//exports
export default router;
