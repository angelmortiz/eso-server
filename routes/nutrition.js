const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();

const foods = [];

router.get('/food', (request, response, next) => {
  response.render('./nutrition/view-food', {
    foods: foods,
    pageTitle: 'Food Information'
  });
});

router.get('/add-food', (request, response, next) => {
  response.render('./nutrition/add-food');
});

router.post('/food', (request, response, next) => {
  //add food info to db

  foods.push({ name: request.body.name });
  console.log(foods);
  // response.redirect('/nutrition/food')
});

exports.routes = router;
exports.foods = foods;
