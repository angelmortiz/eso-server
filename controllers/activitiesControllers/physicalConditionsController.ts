import {NextFunction, Request, Response} from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetPhysicalConditions = async (req: Request, res: Response) => {
  const physicalConditions = await PhysicalConditionHandler.getAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(physicalConditions));
};

export const apiGetPhysicalConditionNames = async (req: Request, res: Response) => {
  const physicalConditionsNames = await PhysicalConditionHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(physicalConditionsNames));
};

export const apiGetPhysicalConditionById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const physicalConditionsId: string = req.params.physicalConditionsId;
  const physicalConditions = await PhysicalConditionHandler.fetchById(physicalConditionsId);

  if (!physicalConditions) { return next(new AppError(`No physicalConditions found using id '${physicalConditionsId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(physicalConditions));
});

export const apiAddPhysicalCondition = async (req: Request, res: Response) => {
  let physicalConditionHandler = new PhysicalConditionHandler(req.body);
  
  await physicalConditionHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdatePhysicalCondition = catchAsync(async (req: Request, res: Response) => {
  let physicalConditionHandler = new PhysicalConditionHandler(req.body);

  await physicalConditionHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeletePhysicalCondition = catchAsync(async (req: Request, res: Response) => {
  const physicalConditionsId: string = req.params.physicalConditionsId;

  await PhysicalConditionHandler.deleteById(physicalConditionsId);
  //removes the physicalConditions from physicalConditions list (cached ids and names)
  PhysicalConditionHandler.removeNameById(physicalConditionsId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});