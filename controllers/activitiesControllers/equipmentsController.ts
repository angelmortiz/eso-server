import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetEquipments = catchAsync(async (req: Request, res: Response) => {
  const equipments = await EquipmentHandler.fetchAll();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(equipments));
});

export const apiGetEquipmentNames = async (req: Request, res: Response) => {
  const equipmentNames = await EquipmentHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(equipmentNames));
};

export const apiGetEquipmentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const equipmentId: string = req.params.equipmentId;
  const equipment = await EquipmentHandler.fetchById(equipmentId);

  if (!equipment) { return next(new AppError(`No equipment found using id '${equipmentId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(equipment));
});

export const apiAddEquipment = async (req: Request, res: Response) => {
  let equipmentHandler = new EquipmentHandler(req.body);
  
  await equipmentHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdateEquipment = catchAsync(async (req: Request, res: Response) => {
  let equipmentHandler = new EquipmentHandler(req.body);

  await equipmentHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteEquipment = async (req: Request, res: Response) => {
  const equipmentId: string = req.params.equipmentId;

  await EquipmentHandler.deleteById(equipmentId);
  //removes the equipment from equipment list (cached ids and names)
  EquipmentHandler.removeNameById(equipmentId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
};