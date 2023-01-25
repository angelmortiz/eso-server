import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import MuscleHandler from '../../models/activitiesModels/muscleModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetMuscles = async (req: Request, res: Response) => {
  const muscles = await MuscleHandler.getAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscles));
};

export const apiGetMuscleNames = async (req: Request, res: Response) => {
  const muscleNames = await MuscleHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscleNames));
};

export const apiGetMuscleById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const muscleId: string = req.params.muscleId;
  const muscle = await MuscleHandler.fetchById(muscleId);

  if (!muscle) { return next(new AppError(`No muscle found using id '${muscleId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscle));
});

export const apiAddMuscle = async (req: Request, res: Response) => {
  let muscleHandler = new MuscleHandler(req.body);
  
  await muscleHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdateMuscle = catchAsync(async (req: Request, res: Response) => {
  let muscleHandler = new MuscleHandler(req.body);

  await muscleHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteMuscle = catchAsync(async (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;

  await MuscleHandler.deleteById(muscleId);
  //removes the muscle from muscles list (cached ids and names)
  MuscleHandler.removeNameById(muscleId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});