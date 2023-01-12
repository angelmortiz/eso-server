import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetExercises = catchAsync(async (req: Request, res: Response) => {
    res.status(RESPONSE_CODE.OK).json(await ExerciseHandler.fetchAll());
});

export const apiGetExerciseNames = catchAsync(async (req: Request, res: Response) => {
    res.status(RESPONSE_CODE.OK).json(await ExerciseHandler.fetchAllNames());
});

export const apiGetExerciseById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const exerciseId: string = req.params.exerciseId;
  const exercise = await ExerciseHandler.fetchById(exerciseId);

  if (!exercise) { return next(new AppError(`No exercise found using id '${exerciseId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(exercise));
});

export const apiGetExerciseTypes = async (req: Request, res: Response) => {
    res.json(ExerciseHandler.exercisesStaticValues.types);
};

export const apiAddExercise = catchAsync(async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);
  
  await exerciseHandler.save();
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.ADDED_SUCCESSFULLY());
});

export const apiUpdateExercise = async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);
  
  //TODO: Implement an error catcher
  exerciseHandler.update().then( _ => res.json(RESPONSE.UPDATED_SUCCESSFULLY()) );
};

export const apiDeleteExercise = catchAsync(async (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;

  await ExerciseHandler.deleteById(exerciseId);
  //removes the exercise from exercises list (cached ids and names)
  ExerciseHandler.removeNameById(exerciseId);
  res.json(RESPONSE.DELETED_SUCCESSFULLY());
});