//imports
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
router.post('/recipe', recipesController.addRecipe);

/* DIET */
router.get('/diet', dietsController.getDiet);
router.get('/add-diet', dietsController.getAddDiet);
router.post('/diet', dietsController.addDiet);


/* CHRONIC CONDITION */
router.get('/chronicCondition', chronicConditionsController.getChronicConditions);
router.get('/add-chronicCondition', chronicConditionsController.getAddChronicConditions);
router.post('/chronicCondition', chronicConditionsController.addChronicCondition);

//exports
exports.routes = router;
