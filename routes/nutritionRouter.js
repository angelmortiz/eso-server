//imports
const express = require('express');
const router = express.Router();

//Controllers imports
const foodsController = require('../controllers/nutritionControllers/foodsController');
const recipesController = require('../controllers/nutritionControllers/recipesController');
const dietsController = require('../controllers/nutritionControllers/dietsController');
const chronicConditionsController = require('../controllers/nutritionControllers/chronicConditionsController');
const menstrualCyclePhasesController = require('../controllers/general/menstrualCyclePhasesController');

/* FOOD */
//Renders
router.get('/food', foodsController.getFood); //FIXME: CHANGE TO /food-view
router.get('/food/:foodId', foodsController.getFoodInfo);
router.post('/update-food/:foodId', foodsController.updateFood);
router.post('/redirect-to-food-info', foodsController.redirectToFoodInfo);
router.get('/add-food', foodsController.getAddFood);
//APIs
router.delete('/food/:foodId', foodsController.apiDeleteFood);
//router.post('/food', foodsController.addFood);

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
exports.routes = router;
