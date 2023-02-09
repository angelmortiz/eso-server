import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ProgramPlanHandler from '../../models/activitiesModels/programPlanModel';
import AppError from '../../util/errors/appError';
import ProgramHandler from '../../models/activitiesModels/programModel';
import UserAuthHandler from '../../models/userModels/userAuthModel';
import WorkoutHandler from '../../models/activitiesModels/workoutModel';

/** APIS */
export const apiGetProgramPlanById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const programPlanId: string = req.params.programPlanId;
    const programPlan = await ProgramPlanHandler.fetchById(programPlanId);

    if (!programPlan) {
      return next(
        new AppError(`No programPlan found using id '${programPlanId}'.`, 404)
      );
    }
    res
      .status(RESPONSE_CODE.OK)
      .json(RESPONSE.FETCHED_SUCCESSFULLY(programPlan));
  }
);

export const apiAddProgramPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { program, assignedTo } = req.body;
    const assignedBy = res.locals.user.id;

    if (!program || !assignedTo || !assignedBy) {
      return next(
        new AppError(`'programId' and 'assignedToId' are required fields.`, 400)
      );
    }

    let programPlan = {
      program,
      assignedTo,
      assignedOn: Date.now(),
      assignedBy,
    };

    programPlan = await createWeeksPlan(programPlan);

    await ProgramPlanHandler.save(programPlan);
    res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
  }
);

export const apiUpdateProgramPlan = catchAsync(
  async (req: Request, res: Response) => {
    const programPlanId: string = req.params.programPlanId;

    await ProgramPlanHandler.update(programPlanId, req.body);
    res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
  }
);

export const apiDeleteProgramPlan = catchAsync(
  async (req: Request, res: Response) => {
    const programPlanId: string = req.params.programPlanId;

    await ProgramPlanHandler.deleteById(programPlanId);
    res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
  }
);


/** ADDITIONAL FUNCTIONS */

const createWeeksPlan = async (programPlan) => {
    const programObj = await ProgramHandler.fetchById(programPlan.program);
    const arrWorkoutIds = programObj?.workouts?.map(workout => workout._id);
    const setWorkoutsIds = new Set(arrWorkoutIds); //removes duplicates

    const arrWorkoutObjs: any[] = [];
    setWorkoutsIds.forEach(async woId => {
        const workoutObj = await WorkoutHandler.fetchById(woId);

        let workout = {
            workoutId: woId,
            exercises:  workoutObj?.exercises
        };

        arrWorkoutObjs.push(workout);
    })

    return programPlan;
};