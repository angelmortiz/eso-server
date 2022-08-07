//imports
const express = require('express');
const router = express.Router();

//Controllers imports
const foodsController = require('../controllers/nutritionControllers/foodsController');
const recipesController = require('../controllers/nutritionControllers/recipesController');
const dietsController = require('../controllers/nutritionControllers/dietsController');
const chronicConditionsController = require('../controllers/nutritionControllers/chronicConditionsController');

/* FOOD */
router.get('/food', foodsController.getFood);
router.get('/food/:foodId', foodsController.getFoodInfo);
router.post('/redirect-to-food-info', foodsController.redirectToFoodInfo);
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
