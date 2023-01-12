
import {NextFunction, Request, Response} from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import AppError from '../../util/errors/appError';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';

/** APIS */
export const apiGetChronicConditions = async (req: Request, res: Response) => {
  const chronicConditions = await ChronicConditionHandler.getAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(chronicConditions));
};

export const apiGetChronicConditionNames = async (req: Request, res: Response) => {
  const chronicConditionsNames = await ChronicConditionHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(chronicConditionsNames));
};

export const apiGetChronicConditionById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const chronicConditionsId: string = req.params.chronicConditionsId;
  const chronicConditions = await ChronicConditionHandler.fetchById(chronicConditionsId);

  if (!chronicConditions) { return next(new AppError(`No chronicConditions found using id '${chronicConditionsId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(chronicConditions));
});

export const apiAddChronicCondition = async (req: Request, res: Response) => {
  let chronicConditionHandler = new ChronicConditionHandler(req.body);
  
  await chronicConditionHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdateChronicCondition = catchAsync(async (req: Request, res: Response) => {
  let chronicConditionHandler = new ChronicConditionHandler(req.body);

  await chronicConditionHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteChronicCondition = catchAsync(async (req: Request, res: Response) => {
  const chronicConditionsId: string = req.params.chronicConditionsId;

  await ChronicConditionHandler.deleteById(chronicConditionsId);
  //removes the chronicConditions from chronicConditions list (cached ids and names)
  ChronicConditionHandler.removeNameById(chronicConditionsId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});