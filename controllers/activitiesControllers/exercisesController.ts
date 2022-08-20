import {Request, Response} from 'express';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';

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
    const exercise = new ExerciseHandler(request.body);
    exercise.save();
    console.log(ExerciseHandler.fetchAll());
    // response.redirect('/activities/exercise');
};

/** APIS */
export const apiGetExercises = (req: Request, res: Response) => {
    res.json(ExerciseHandler.exercisesStaticValues.exercises);
};