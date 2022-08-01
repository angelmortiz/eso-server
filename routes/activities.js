const express = require('express');
const router = express.Router();

const exercises = [];
const muscles = [];

/* EXERCISE */
router.get('/exercise', (request, response, next) => {
    response.render('./activities/view-exercise', {
        exercises: exercises,
        pageTitle: 'Información de ejercicio'
      });
});

router.get('/add-exercise', (request, response, next) => {
    response.render('./activities/add-exercise', {
        exercises: exercises,
        pageTitle: 'Añadir ejercicio'
      });
});

router.post('/exercise', (request, response, next) => {
    //add exercise info to db

    exercises.push({name: request.body.name});
    console.log(exercises);

    // response.redirect('/activities/exercise');
});

/* MUSCLE */
router.get('/muscle', (request, response, next) => {
    response.render('./activities/view-muscle', {
        muscles: muscles,
        pageTitle: 'Información de músculo'
      });
});

router.get('/add-muscle', (request, response, next) => {
    response.render('./activities/add-muscle', {
        muscles: muscles,
        pageTitle: 'Añadir músculo'
      });
});

exports.routes = router;
exports.exercises = exercises;