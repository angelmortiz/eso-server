const express = require('express');
const router = express.Router();

const foods = [];
const diets = [];
const chronicCondition = [];


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

/* RECIPE */
router.get('/recipe', (request, response, next) => {
  response.render('./nutrition/view-recipe', {
    diets: diets,
    pageTitle: 'Información de receta'
  });
});

router.get('/add-recipe', (request, response, next) => {
  response.render('./nutrition/add-recipe', {
    diets: diets,
    pageTitle: 'Añadir receta'
  });
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

/* CHRONIC CONDITION */
router.get('/chronicCondition', (request, response, next) => {
  response.render('./nutrition/view-chronicCondition', {
    chronicCondition: chronicCondition,
    pageTitle: 'Información de condición crónica'
  });
});

router.get('/add-chronicCondition', (request, response, next) => {
  response.render('./nutrition/add-chronicCondition', {
    chronicCondition: chronicCondition,
    pageTitle: 'Añadir condición crónica'
  });
});

exports.routes = router;
exports.foods = foods;
