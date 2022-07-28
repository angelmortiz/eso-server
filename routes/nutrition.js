const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();

const foods = [];

router.get('/food', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'nutrition', 'view-food.html'));
});

router.get('/add-food', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'nutrition', 'add-food.html'));
});

router.post('/food', (request, response, next) => {
    //add food info to db

    foods.push({name: request.body.name})
    console.log(foods);
    // response.redirect('/nutrition/food')
});

exports.routes = router;
exports.foods = foods; 
