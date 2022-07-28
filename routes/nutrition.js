const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/food', (request, response, next) => {
    response.sendFile(path.join(__dirname, '../', 'views', 'nutrition', 'get-food.html'));
});

router.post('/food', (request, response, next) => {
    response.sendFile(path.join(__dirname, '../', 'views', 'nutrition', 'add-food.html'));
});

module.exports = router;
