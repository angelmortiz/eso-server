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
    const {userId, filter} = req.params;
    const programHistories = await ProgramHistoryHandler.fetchByAssignedTo(userId, filter === "completed");

    if (!programHistories) { return next(new AppError(`No program histories found using id '${userId}'.`, 404)); }
    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistories));
  });

export const apiGetProgramHistoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const programHistoryId: string = req.params.programHistoryId;
  const programHistory = await ProgramHistoryHandler.fetchById(programHistoryId);

  if (!programHistory) { return next(new AppError(`No program history found using id '${programHistoryId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistory));
});

export const apiAddProgramHistory = catchAsync(async (req: Request, res: Response) => {
  //defaults to current user id if no assignedBy id was provided
  if (!req.body.assignedBy) {
    req.body.assignedBy = res.locals.user.id;
  }

  req.body.assignedOn = Date.now();
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