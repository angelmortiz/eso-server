import { Request, Response } from 'express';
import  *  as ResponseCodes from '../general/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';

/** APIS */
export const apiGetExercises = async (req: Request, res: Response) => {
    res.json(await ExerciseHandler.fetchAll());
};

export const apiGetExerciseNames = async (req: Request, res: Response) => {
    res.json(await ExerciseHandler.fetchAllNames());
};

export const apiGetExerciseById = async (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;

  res.json(await ExerciseHandler.fetchById(exerciseId));
};

export const apiGetExerciseTypes = (req: Request, res: Response) => {
    res.json(ExerciseHandler.exercisesStaticValues.types);
};

export const apiAddExercise = async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);

  //TODO: Implement an error catcher
  exerciseHandler.save().then( _ => res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY()) );
};

export const apiUpdateExercise = async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);
  
  //TODO: Implement an error catcher
  exerciseHandler.update().then( _ => res.json(ResponseCodes.RESPONSE_UPDATED_SUCCESSFULLY()) );
};

export const apiDeleteExercise = (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;

  ExerciseHandler.deleteById(exerciseId)
  .then( deleteResponse => {
    //removes the exercise from exercises dropdown
    //removes the food from foods dropdown
    ExerciseHandler.removeNameById(exerciseId);
    console.log(`'${deleteResponse.name}' exercise deleted successfully.`);
    res.json(ResponseCodes.RESPONSE_DELETED_SUCCESSFULLY())
  })
  .catch(err => {
    console.log('Error while deleting Exercise: ', err);
    res.json(ResponseCodes.RESPONSE_DELETE_FAILED())
  });
};