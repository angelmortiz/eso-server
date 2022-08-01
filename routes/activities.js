const express = require('express');
const router = express.Router();

const exercises = [];
const muscles = [];
const equipments = [];
const physicalCondition = [];

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

/* EQUIPMENT */
router.get('/equipment', (request, response, next) => {
    response.render('./activities/view-equipment', {
        equipments: equipments,
        pageTitle: 'Información de equipo'
      });
});

router.get('/add-equipment', (request, response, next) => {
    response.render('./activities/add-equipment', {
        equipments: equipments,
        pageTitle: 'Añadir equipo'
      });
});

/* Physical Condition */
router.get('/physicalCondition', (request, response, next) => {
    response.render('./activities/view-physicalCondition', {
        physicalCondition: physicalCondition,
        pageTitle: 'Información de condición física'
      });
});

router.get('/add-physicalCondition', (request, response, next) => {
    response.render('./activities/add-physicalCondition', {
        physicalCondition: physicalCondition,
        pageTitle: 'Añadir condición física'
      });
});

exports.routes = router;
exports.exercises = exercises;