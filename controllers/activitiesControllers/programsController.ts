import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ProgramHandler from '../../models/activitiesModels/programModel';
import AppError from '../../util/errors/appError';

/** APIS */
export const apiGetPrograms = catchAsync(async (req: Request, res: Response) => {
  const programs = await ProgramHandler.fetchAll();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programs));
});

export const apiGetProgramNames = catchAsync(async (req: Request, res: Response) => {
  const programNames = await ProgramHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programNames));
});

export const apiGetProgramById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const programId: string = req.params.programId;
  const program = await ProgramHandler.fetchById(programId);
  
  if (!program) { return next(new AppError(`No program found using id '${programId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(program));
});

export const apiAddProgram = catchAsync(async (req: Request, res: Response) => {
  let programHandler = new ProgramHandler(req.body);
  
  await programHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
});

export const apiUpdateProgram = catchAsync(async (req: Request, res: Response) => {
  let programHandler = new ProgramHandler(req.body);

  await programHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteProgram = catchAsync(async (req: Request, res: Response) => {
  const programId: string = req.params.programId;

  await ProgramHandler.deleteById(programId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});