//imports
const express = require('express');
const router = express.Router();

//Controllers imports
const foodsController = require('../controllers/nutrition/foodsController');
const recipesController = require('../controllers/nutrition/recipesController');
const dietsController = require('../controllers/nutrition/dietsController');
const chronicConditionsController = require('../controllers/nutrition/chronicConditionsController');

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
