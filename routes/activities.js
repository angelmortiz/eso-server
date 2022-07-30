const express = require('express');
const router = express.Router();

const exercises = [];

router.get('/exercise', (request, response, next) => {
    response.render('./activities/view-exercise', {
        exercises: exercises,
        pageTitle: 'Exercise Information'
      });
});

router.get('/add-exercise', (request, response, next) => {
    response.render('./activities/add-exercise', {
        exercises: exercises,
        pageTitle: 'Exercise Information'
      });
});

router.post('/exercise', (request, response, next) => {
    //add exercise info to db

    exercises.push({name: request.body.name});
    console.log(exercises);

    // response.redirect('/activities/exercise');
});

exports.routes = router;
exports.exercises = exercises;