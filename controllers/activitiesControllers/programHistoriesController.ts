import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ProgramHistoryHandler from '../../models/activitiesModels/programHistoryModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetProgramHistories = catchAsync(async (req: Request, res: Response) => {
  const programHistories = await ProgramHistoryHandler.fetchAll();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistories));
});

export const apiGetProgramHistoriesByAssignedTo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const assignedToId: string = req.params.assignedToId;
    const programHistories = await ProgramHistoryHandler.fetchByAssignedTo(assignedToId);
  
    if (!programHistories) { return next(new AppError(`No program histories found using id '${assignedToId}'.`, 404)); }
    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistories));
  });

export const apiGetProgramHistoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const programHistoryId: string = req.params.programHistoryId;
  const programHistory = await ProgramHistoryHandler.fetchById(programHistoryId);

  if (!programHistory) { return next(new AppError(`No program history found using id '${programHistoryId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistory));
});

export const apiAddProgramHistory = catchAsync(async (req: Request, res: Response) => {
  let programHistoryHandler = new ProgramHistoryHandler(req.body);
  
  await programHistoryHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
});

export const apiUpdateProgramHistory = catchAsync(async (req: Request, res: Response) => {
  let programHistoryHandler = new ProgramHistoryHandler(req.body);

  await programHistoryHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteProgramHistory = catchAsync(async (req: Request, res: Response) => {
  const programHistoryId: string = req.params.programHistoryId;

  await ProgramHistoryHandler.deleteById(programHistoryId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});