import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetEquipments = catchAsync(
  async (req: Request, res: Response) => {
    const equipments = await EquipmentHandler.fetchAll();
    res
      .status(RESPONSE_CODE.OK)
      .json(RESPONSE.FETCHED_SUCCESSFULLY(equipments));
  }
);

export const apiGetEquipmentNames = async (req: Request, res: Response) => {
  const equipmentNames = await EquipmentHandler.fetchAllNames();
  res
    .status(RESPONSE_CODE.OK)
    .json(RESPONSE.FETCHED_SUCCESSFULLY(equipmentNames));
};

export const apiGetEquipmentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const equipmentId: string = req.params.equipmentId;
    const equipment = await EquipmentHandler.fetchById(equipmentId);

    if (!equipment) {
      return next(
        new AppError(`No equipment found using id '${equipmentId}'.`, 404)
      );
    }
    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(equipment));
  }
);

export const apiAddEquipment = async (req: Request, res: Response) => {
  await EquipmentHandler.save(req.body);
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdateEquipment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const equipmentId: string = req.params.equipmentId;
    if (!equipmentId) {
      return next(
        new AppError(`No equipmentId found in the parameters.`, 404)
      );
    }

    await EquipmentHandler.update(equipmentId, req.body);
    res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
  }
);

export const apiDeleteEquipment = async (req: Request, res: Response) => {
  const equipmentId: string = req.params.equipmentId;

  await EquipmentHandler.deleteById(equipmentId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
};
