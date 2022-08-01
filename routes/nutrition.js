const express = require('express');
const router = express.Router();

//Controllers imports
const foodsController = require('../controllers/nutrition/foods');
const recipesController = require('../controllers/nutrition/recipes');
const dietsController = require('../controllers/nutrition/diets');
const chronicConditionsController = require('../controllers/nutrition/chronicConditions');

/* FOOD */
router.get('/food', foodsController.getFood);
router.get('/add-food', foodsController.getAddFood);
router.post('/food', foodsController.addFood);

/* RECIPE */
router.get('/recipe', recipesController.getRecipe);
router.get('/add-recipe', recipesController.getAddRecipe);

/* DIET */
router.get('/diet', dietsController.getDiet);
router.get('/add-diet', dietsController.getAddDiet);

/* CHRONIC CONDITION */
router.get('/chronicCondition', chronicConditionsController.getChronicConditions);
router.get('/add-chronicCondition', chronicConditionsController.getAddChronicConditions);

//exports
exports.routes = router;
