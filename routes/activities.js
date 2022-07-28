const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();

const exercises = [];

router.get('/exercise', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'activities', 'view-exercise.html'));
});

router.get('/add-exercise', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'activities', 'add-exercise.html'));
});

router.post('/exercise', (request, response, next) => {
    //add exercise info to db

    exercises.push({name: request.body.name});
    console.log(exercises);

    // response.redirect('/activities/exercise');
});

exports.routes = router;
exports.exercises = exercises;