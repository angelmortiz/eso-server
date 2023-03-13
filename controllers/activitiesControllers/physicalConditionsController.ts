import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetPhysicalConditions = async (req: Request, res: Response) => {
  const physicalConditions = await PhysicalConditionHandler.fetchAllNames();
  res
    .status(RESPONSE_CODE.OK)
    .json(RESPONSE.FETCHED_SUCCESSFULLY(physicalConditions));
};

export const apiGetPhysicalConditionNames = async (
  req: Request,
  res: Response
) => {
  const physicalConditionsNames =
    await PhysicalConditionHandler.fetchAllNames();
  res
    .status(RESPONSE_CODE.OK)
    .json(RESPONSE.FETCHED_SUCCESSFULLY(physicalConditionsNames));
};

export const apiGetPhysicalConditionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const physicalConditionsId: string = req.params.physicalConditionsId;
    const physicalConditions = await PhysicalConditionHandler.fetchById(
      physicalConditionsId
    );

    if (!physicalConditions) {
      return next(
        new AppError(
          `No physicalConditions found using id '${physicalConditionsId}'.`,
          404
        )
      );
    }
    res
      .status(RESPONSE_CODE.OK)
      .json(RESPONSE.FETCHED_SUCCESSFULLY(physicalConditions));
  }
);

export const apiAddPhysicalCondition = async (req: Request, res: Response) => {
  await PhysicalConditionHandler.save(req.body);
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdatePhysicalCondition = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const physicalConditionId: string = req.params.physicalConditionId;
    if (!physicalConditionId) {
      return next(
        new AppError(`No physicalConditionId found in the parameters.`, 404)
      );
    }

    await PhysicalConditionHandler.update(req.body);
    res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
  }
);

export const apiDeletePhysicalCondition = catchAsync(
  async (req: Request, res: Response) => {
    const physicalConditionsId: string = req.params.physicalConditionsId;

    await PhysicalConditionHandler.deleteById(physicalConditionsId);
    res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
  }
);
