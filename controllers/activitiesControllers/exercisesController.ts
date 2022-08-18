import Exercise from '../../models/activitiesModels/exerciseModel';

export const getExercise = (request, response) => {
    response.render('./activities/view-exercise', {
        caller: 'view-exercise',
        pageTitle: 'Información de ejercicio'
      });
};

export const getAddExercise = (request, response) => {
    response.render('./activities/add-exercise', {
        caller: 'add-exercise',
        pageTitle: 'Añadir ejercicio'
      });
};

export const addExercise = (request) => {
    const exercise = new Exercise(request.body);
    exercise.save();
    console.log(Exercise.fetchAll());
    // response.redirect('/activities/exercise');
};