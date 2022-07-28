const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();

router.get('/food', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'nutrition', 'get-food.html'));
});

router.get('/add-food', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'nutrition', 'add-food.html'));
});

router.post('/food', (request, response, next) => {
    //add food info to db
    response.redirect('/nutrition/food')
});

module.exports = router;
