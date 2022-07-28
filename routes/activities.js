const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/exercise', (request, response, next) => {
    response.sendFile(path.join(__dirname, '../', 'views', 'activities', 'get-exercise.html'));
});

router.post('/exercise', (request, response, next) => {
    response.sendFile(path.join(__dirname, '../', 'views', 'activities', 'add-exercise.html'));
});

module.exports = router;