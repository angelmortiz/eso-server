import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import {
  IProgram,
  IWeekLog,
  IProgramPlan,
  IWeekPlan,
  IWorkoutPlan,
  IWorkoutLog,
  IStatusLog,
  IExerciseLog,
  ISetLog,
  IProgramLog,
} from '../../util/interfaces/activitiesInterfaces';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ProgramPlanHandler from '../../models/activitiesModels/programPlanModel';
import AppError from '../../util/errors/appError';
import ProgramHandler from '../../models/activitiesModels/programModel';

/** APIS */
export const apiGetAssignedProgramPlans = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { userId } = req.params;
    if (!userId) {
      userId = res.locals.user.id;
    }

    if (!userId) {
      return next(new AppError(`No user Id found.`, 400));
    }

    const programPlans = await ProgramPlanHandler.fetchByAssignedTo(userId);
    res
      .status(RESPONSE_CODE.OK)
      .json(RESPONSE.FETCHED_SUCCESSFULLY(programPlans));
  }
);

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
        new AppError(
          `'programId', 'assignedToId', 'assignedBy' are required fields.`,
          400
        )
      );
    }

    const programWithWorkouts = await ProgramHandler.fetchProgramInfo(program);
    if (!programWithWorkouts) {
      return next(new AppError(`No program found with id ${program}.`, 404));
    }

    let programPlan: IProgramPlan = {
      program,
      assignedTo,
      assignedOn: new Date(),
      assignedBy,
    };

    programPlan.weeksPlan = createWeeksPlan(programPlan, programWithWorkouts);
    programPlan.logs = createPlanLogs(programPlan, programWithWorkouts);

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
/**** Program Plan  */
const createWeeksPlan = (
  programPlan: IProgramPlan,
  program: IProgram
): IWeekPlan[] => {
  switch (program.sequence) {
    case 'Weekly':
      return createWeeklyDaysPlan(programPlan, program);
    case 'Cycle':
      return createCycleDaysPlan(programPlan, program);
  }
};

/**
 * Extracts daily workouts from Program and creates a weekly
 * plan with a workout for each day of the week.
 */
const createWeeklyDaysPlan = (programPlan: IProgramPlan, program: IProgram) => {
  /**
   * Creates an array of weeks from 1 to 'duration'.
   * Each day of the week gets assigned a workout from program.
   */
  programPlan.weeksPlan = Array.from(
    { length: program.duration },
    (_, index) => ({
      weekNumber: index + 1,
      workouts: program.workouts!,
    })
  );

  return programPlan.weeksPlan;
};

const createCycleDaysPlan = (programPlan: IProgramPlan, program: IProgram) => {
  if (!program?.workouts || program.workouts.length === 0) return [];

  const numberOfWorkouts = program.workouts.length;
  programPlan.weeksPlan = [];

  /**
   * Creates a list of weeks based on 'program.duration'
   * and assigns a workout to each day of the week based
   * on the workoutPlan info.
   */

  //iterate throw weeks
  for (let week = 1; week <= program.duration; week++) {
    let weekPlan: IWeekPlan = { weekNumber: week, workouts: [] };

    //iterate throw days
    for (let day = 0; day < 7; day++) {
      /**
       * '[day % numberOfWorkouts]' results in indexes that go from
       * '0' to 'numberOfWorkouts - 1'. It makes it possible to cycle
       * through all the workouts of a program and continue repeating them
       * until the end of the programPlan [duration * 7].
       */
      let workout = program.workouts[day % numberOfWorkouts].workout;
      let workoutPlan: IWorkoutPlan = { dayNumber: day + 1, workout };
      weekPlan.workouts?.push(workoutPlan);
    }

    programPlan.weeksPlan.push(weekPlan);
  }
  return programPlan.weeksPlan;
};

/**** Program Logs  */
const createPlanLogs = (
  programPlan: IProgramPlan,
  program: IProgram
): IProgramLog => {
  switch (program.sequence) {
    case 'Weekly':
      return createWeeklyPlanLogs(programPlan, program);
    case 'Cycle':
      return createCyclePlanLogs(programPlan, program);
  }
};

const createWeeklyPlanLogs = (programPlan: IProgramPlan, program: IProgram) => {
  const defaultLogValues: IStatusLog = {
    isStarted: false,
    isCompleted: false,
    isSkipped: false,
  };

  programPlan.logs = {
    log: { ...defaultLogValues },
    weeksLog: [] as IWeekLog[],
  };

  programPlan.logs.weeksLog = Array.from(
    { length: program.duration },
    (_, index) => ({
      weekNumber: index + 1,
      workouts: program.workouts!.map((wo) => ({
        workout: wo.workout,
        dayOfTheWeek: wo.dayOfTheWeek,
        log: { ...defaultLogValues },
        exercises: wo.workout.exercises!.map((ex) => ({
          exercise: ex.exercise,
          log: { ...defaultLogValues },
          sets: [] as ISetLog[],
        })) as IExerciseLog[],
      })) as IWorkoutLog[],
    })
  ) as IWeekLog[];

  return programPlan.logs;
};

const createCyclePlanLogs = (programPlan: IProgramPlan, program: IProgram) => {
  const defaultLogValues: IStatusLog = {
    isStarted: false,
    isCompleted: false,
    isSkipped: false,
  };

  programPlan.logs = {
    log: { ...defaultLogValues },
    weeksLog: [] as IWeekLog[],
  };

  return programPlan.logs;
};
