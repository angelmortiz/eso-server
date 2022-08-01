const exercises = [];

exports.getExercise = (request, response, next) => {
    response.render('./activities/view-exercise', {
        caller: 'view-exercise',
        exercises: exercises,
        pageTitle: 'Información de ejercicio'
      });
};

exports.getAddExercise = (request, response, next) => {
    response.render('./activities/add-exercise', {
        caller: 'add-exercise',
        exercises: exercises,
        pageTitle: 'Añadir ejercicio'
      });
};

exports.addExercise = (request, response, next) => {
    //add exercise info to db

    exercises.push({name: request.body.name});
    console.log(exercises);

    // response.redirect('/activities/exercise');
};