import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ProgramHistoryHandler from '../../models/activitiesModels/programHistoryModel';
import AppError from '../../util/errors/appError';
import ProgramHandler from '../../models/activitiesModels/programModel';
import {
  IProgramHistory,
  IWorkoutLogs
} from '../../util/interfaces/activitiesInterfaces';

/** APIS */
export const apiGetProgramHistories = catchAsync(async (req: Request, res: Response) => {
  const programHistories = await ProgramHistoryHandler.fetchAll();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistories));
});

export const apiGetProgramHistoriesByAssignedTo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let {userId, filter} = req.params;
    if (!userId) {
      userId = res.locals.user.id;
    }

    const programHistories = await ProgramHistoryHandler.fetchByAssignedTo(userId, filter === "completed");

    if (!programHistories) { return next(new AppError(`No program histories found using id '${userId}'.`, 404)); }
    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistories));
  });

export const apiGetProgramHistoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const programHistoryId: string = req.params.programHistoryId;
  const [ programHistory ] = await ProgramHistoryHandler.fetchById(programHistoryId); //destructure array to pick the first element

  if (!programHistory) { return next(new AppError(`No program history found using id '${programHistoryId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(programHistory));
});

export const apiAddProgramHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //defaults to current user id if no assignedBy id was provided
  if (!req.body.assignedBy) {
    req.body.assignedBy = res.locals.user.id;
  }
  req.body.assignedOn = Date.now();

  const programHandler = await ProgramHandler.fetchById(req.body.programId);
  if (!programHandler) { return next(new AppError(`No program found using id '${req.body.programId}'.`, 404)); }

  const programHistory = addWorkoutLogHolders(req.body, programHandler);
  const programHistoryHandler = new ProgramHistoryHandler(programHistory);

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


/** ADDITIONAL FUNCTIONS */
const addWorkoutLogHolders = (history: IProgramHistory, program: ProgramHandler | null) => {
  switch (program?.sequence) {
    case 'Weekly':
      return addWeeklyWorkoutLogs(history, program);
    case 'Cycle':
      return addCycleWorkoutLogs(history, program);
  }
};

const addWeeklyWorkoutLogs = (history: IProgramHistory, program: ProgramHandler) => {
  history.workoutLogs = [];

  for (let week = 1; week <= program.duration; week++) {
    program.workouts?.forEach(workout => {
      const workoutLog: IWorkoutLogs = {
        workoutId: workout.id,
        isStarted: false,
        isCompleted: false
      };

      history.workoutLogs?.push(workoutLog);
    })
  }
  
  return history;
};

const addCycleWorkoutLogs = (history: IProgramHistory, program: ProgramHandler) => {
  
  return history;
};