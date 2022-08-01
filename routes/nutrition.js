const express = require('express');
const router = express.Router();

const foods = [];
const diets = [];


/* FOOD */
router.get('/food', (request, response, next) => {
  response.render('./nutrition/view-food', {
    foods: foods,
    pageTitle: 'Información de comida'
  });
});

router.get('/add-food', (request, response, next) => {
  response.render('./nutrition/add-food', {
    foods: foods,
    pageTitle: 'Añadir comida'
  });
});

router.post('/food', (request, response, next) => {
  //add food info to db

  foods.push({ name: request.body.name });
  console.log(foods);
  // response.redirect('/nutrition/food')
});

/* DIET */
router.get('/diet', (request, response, next) => {
  response.render('./nutrition/view-diet', {
    diets: diets,
    pageTitle: 'Información de dieta'
  });
});

router.get('/add-diet', (request, response, next) => {
  response.render('./nutrition/add-diet', {
    diets: diets,
    pageTitle: 'Añadir dieta'
  });
});

exports.routes = router;
exports.foods = foods;
