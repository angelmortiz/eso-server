const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();

router.get('/exercise', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'activities', 'get-exercise.html'));
});

router.get('/add-exercise', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'activities', 'add-exercise.html'));
});

router.post('/exercise', (request, response, next) => {
    //add exercise info to db
    response.redirect('/activities/exercise')
});

module.exports = router;