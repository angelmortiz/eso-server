const Exercise = require('../../models/activitiesModels/exerciseModel');

exports.getExercise = (request, response) => {
    response.render('./activities/view-exercise', {
        caller: 'view-exercise',
        pageTitle: 'Información de ejercicio'
      });
};

exports.getAddExercise = (request, response) => {
    response.render('./activities/add-exercise', {
        caller: 'add-exercise',
        pageTitle: 'Añadir ejercicio'
      });
};

exports.addExercise = (request) => {
    const exercise = new Exercise(request.body);
    exercise.save();
    console.log(Exercise.fetchAll());
    // response.redirect('/activities/exercise');
};