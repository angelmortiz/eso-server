import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import WorkoutHandler from '../../models/activitiesModels/workoutModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetWorkouts = catchAsync(async (req: Request, res: Response) => {
  const workouts = await WorkoutHandler.fetchAll();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(workouts));
});

export const apiGetWorkoutNames = catchAsync(async (req: Request, res: Response) => {
  const workoutNames = await WorkoutHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(workoutNames));
});

export const apiGetWorkoutById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const workoutId: string = req.params.workoutId;
  const workout = await WorkoutHandler.fetchById(workoutId);

  if (!workout) { return next(new AppError(`No workout found using id '${workoutId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(workout));
});

export const apiAddWorkout = catchAsync(async (req: Request, res: Response) => {
  let workoutHandler = new WorkoutHandler(req.body);
  
  await workoutHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
});

export const apiUpdateWorkout = catchAsync(async (req: Request, res: Response) => {
  let workoutHandler = new WorkoutHandler(req.body);
  
  await workoutHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteWorkout = catchAsync(async (req: Request, res: Response) => {
  const workoutId: string = req.params.workoutId;

  await WorkoutHandler.deleteById(workoutId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});