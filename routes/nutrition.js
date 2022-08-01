const express = require('express');
const router = express.Router();
const foodController = require('../controllers/nutrition/foods');
const recipeController = require('../controllers/nutrition/recipes');
const dietController = require('../controllers/nutrition/diets');
const chronicConditionController = require('../controllers/nutrition/chronicConditions');

/* FOOD */
router.get('/food', foodController.getFood);
router.get('/add-food', foodController.getAddFood);
router.post('/food', foodController.addFood);

/* RECIPE */
router.get('/recipe', recipeController.getRecipe);
router.get('/add-recipe', recipeController.getAddRecipe);

/* DIET */
router.get('/diet', dietController.getDiet);
router.get('/add-diet', dietController.getAddDiet);

/* CHRONIC CONDITION */
router.get('/chronicCondition', chronicConditionController.getChronicConditions);
router.get('/add-chronicCondition', chronicConditionController.getAddChronicConditions);

//exports
exports.routes = router;
