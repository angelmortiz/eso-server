import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetExercises = catchAsync(async (req: Request, res: Response) => {
  const exercises = await ExerciseHandler.fetchAll();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(exercises));
});

export const apiGetExerciseNames = catchAsync(async (req: Request, res: Response) => {
  const exerciseNames = await ExerciseHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(exerciseNames));
});

export const apiGetExerciseById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const exerciseId: string = req.params.exerciseId;
  const exercise = await ExerciseHandler.fetchById(exerciseId);

  if (!exercise) { return next(new AppError(`No exercise found using id '${exerciseId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(exercise));
});

export const apiGetExerciseTypes = (req: Request, res: Response) => {
  const types = ExerciseHandler.exercisesStaticValues.types;
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(types));
};

export const apiAddExercise = catchAsync(async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);
  
  await exerciseHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
});

export const apiUpdateExercise = catchAsync(async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);

  await exerciseHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteExercise = catchAsync(async (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;

  await ExerciseHandler.deleteById(exerciseId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});