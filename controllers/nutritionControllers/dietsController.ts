import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import AppError from '../../util/errors/appError';
import DietHandler from '../../models/nutritionModels/dietModel';

/** APIS */
export const apiGetDiets = async (req: Request, res: Response) => {
  const muscles = await DietHandler.getAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscles));
};

export const apiGetDietNames = async (req: Request, res: Response) => {
  const muscleNames = await DietHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscleNames));
};

export const apiGetDietById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const muscleId: string = req.params.muscleId;
  const muscle = await DietHandler.fetchById(muscleId);

  if (!muscle) { return next(new AppError(`No muscle found using id '${muscleId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscle));
});

export const apiAddDiet = async (req: Request, res: Response) => {
  let muscleHandler = new DietHandler(req.body);
  
  await muscleHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdateDiet = catchAsync(async (req: Request, res: Response) => {
  let muscleHandler = new DietHandler(req.body);

  await muscleHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteDiet = catchAsync(async (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;

  await DietHandler.deleteById(muscleId);
  //removes the muscle from muscles list (cached ids and names)
  DietHandler.removeNameById(muscleId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});