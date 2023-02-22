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
  ISetLog
} from '../../util/interfaces/activitiesInterfaces';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ProgramPlanHandler from '../../models/activitiesModels/programPlanModel';
import AppError from '../../util/errors/appError';
import ProgramHandler from '../../models/activitiesModels/programModel';
import { ObjectId } from 'mongodb';

/** APIS */
export const apiGetAssignedProgramPlans = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { userId, filter } = req.params;
    if (!userId) {
      userId = res.locals.user.id;
    }
    if (!userId) {
      return next(new AppError(`No user Id found.`, 400));
    }

    const programPlans = await ProgramPlanHandler.fetchByAssignedTo(
      userId,
      filter === 'completed'
    );
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

export const apiGetProgramPlanLogsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const programPlanId: string = req.params.programPlanId;
    const programPlanLogs = await ProgramPlanHandler.fetchPlanLogsById(
      programPlanId
    );

    if (!programPlanLogs) {
      return next(
        new AppError(`No programPlan found using id '${programPlanId}'.`, 404)
      );
    }
    res
      .status(RESPONSE_CODE.OK)
      .json(RESPONSE.FETCHED_SUCCESSFULLY(programPlanLogs));
  }
);

export const apiGetWorkoutLogsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { programPlanId, weekNumber, workoutId } = req.params;

    const programPlanLogs = await ProgramPlanHandler.fetchWorkoutPlanLogs(
      programPlanId
    );

    if (!programPlanLogs) {
      return next(
        new AppError(
          `No workout plan found using programPlanId '${programPlanId}'.`,
          404
        )
      );
    }

    //extracts workout plan section from the entire program plan object
    const workoutPlanLog = programPlanLogs.logs?.weeksLog[
      parseInt(weekNumber) - 1
    ]?.workouts?.find((wo) => wo!._id!.equals(new ObjectId(workoutId)));

    if (!workoutPlanLog) {
      return next(
        new AppError(
          `No workout plan found using workoutId '${workoutId}'.`,
          404
        )
      );
    }

    res
      .status(RESPONSE_CODE.OK)
      .json(RESPONSE.FETCHED_SUCCESSFULLY(workoutPlanLog));
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

    if (program?.workouts || program?.workouts?.length === 0) {
      return next(
        new AppError(`No workouts found in program id '${program}'.`, 400)
      );
    }

    createWeekPlans(programPlan, programWithWorkouts);
    createPlanLogs(programPlan, programWithWorkouts);

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

export const apiAddSetLog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { programPlanId, weekId, workoutPlanId, exercisePlanId } = req.params;
    const paramVals = {programPlanId, weekId, workoutPlanId, exercisePlanId}
    
    await ProgramPlanHandler.addSetLog(paramVals, req.body);
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
const createWeekPlans = (programPlan: IProgramPlan, program: IProgram) => {
  switch (program.sequence) {
    case 'Weekly':
      createWeeklyPlan(programPlan, program);
      break;
    case 'Cycle':
      createCyclePlan(programPlan, program);
      break;
  }
};

/**
 * Extracts daily workouts from Program and creates a weekly
 * plan with a workout for each day of the week.
 */
const createWeeklyPlan = (programPlan: IProgramPlan, program: IProgram) => {
  /**
   * Creates an array of weeks from 1 to 'duration'.
   * Each day of the week gets assigned a workout from program.
   */

  programPlan.weeksPlan = Array.from(
    { length: program.duration },
    (_, index) => ({
      weekNumber: index + 1,
      workouts: program.workouts,
    })
  );
};

const createCyclePlan = (programPlan: IProgramPlan, program: IProgram) => {
  const numberOfWorkouts = program.workouts!.length;
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
      let workout = program.workouts![day % numberOfWorkouts].workout;
      let workoutPlan: IWorkoutPlan = { dayNumber: day + 1, workout };
      weekPlan.workouts?.push(workoutPlan);
    }

    programPlan.weeksPlan.push(weekPlan);
  }
};

/**** Program Logs  */
const createPlanLogs = (programPlan: IProgramPlan, program: IProgram) => {
  switch (program.sequence) {
    case 'Weekly':
      createWeeklyLogs(programPlan, program);
      break;
    case 'Cycle':
      createCycleLogs(programPlan, program);
      break;
  }
};

const createWeeklyLogs = (programPlan: IProgramPlan, program: IProgram) => {
  const defaultLogValues: IStatusLog = {
    isStarted: false,
    isCompleted: false,
    isSkipped: false,
  };

  programPlan.logs = {
    log: { ...defaultLogValues },
    weeksLog: [] as IWeekLog[],
  };

  //**Sequence: Program -> weeks[] -> workouts[] (1 per day of the week) -> exercises[] -> sets[]
  //creates an array of logs based on the number of weeks from program
  programPlan.logs.weeksLog = Array.from(
    { length: program.duration },
    (_, index) => ({
      weekNumber: index + 1,
      //extracts the workout per day of the week and sets default log vals
      workouts: program.workouts!.map((wo) => ({
        workout: wo.workout,
        dayOfTheWeek: wo.dayOfTheWeek,
        log: { ...defaultLogValues },
        //extracts the exercises per workout sets default log vals
        exercises: wo.workout.exercises!.map((ex) => ({
          exercise: ex.exercise,
          log: { ...defaultLogValues },
          //prepares array for the set logs
          sets: [] as ISetLog[],
        })) as IExerciseLog[],
      })) as IWorkoutLog[],
    })
  ) as IWeekLog[];
};

const createCycleLogs = (programPlan: IProgramPlan, program: IProgram) => {
  const defaultLogValues: IStatusLog = {
    isStarted: false,
    isCompleted: false,
    isSkipped: false,
  };

  programPlan.logs = {
    log: { ...defaultLogValues },
    weeksLog: [] as IWeekLog[],
  };

  const numberOfWorkouts = program.workouts!.length;
  /**
   * Creates a list of weeks based on 'program.duration'
   * and assigns a workout log to each day of the week based
   * on the workoutPlan info.
   */

  //iterate throw weeks
  for (let week = 1; week <= program.duration; week++) {
    let weekLog: IWeekLog = { weekNumber: week, workouts: [] as IWorkoutLog[] };

    //iterate throw days
    for (let day = 0; day < 7; day++) {
      /**
       * '[day % numberOfWorkouts]' results in indexes that go from
       * '0' to 'numberOfWorkouts - 1'. It makes it possible to cycle
       * through all the workouts of a program and continue repeating them
       * until the end of the programPlan [duration * 7].
       */
      let workout = program.workouts![day % numberOfWorkouts].workout;
      let workoutLog: IWorkoutLog = {
        dayNumber: day + 1,
        workout,
        log: { ...defaultLogValues },
        exercises: workout.exercises!.map((ex) => ({
          exercise: ex.exercise,
          log: { ...defaultLogValues },
          //prepares array for the set logs
          sets: [] as ISetLog[],
        })) as IExerciseLog[],
      };
      weekLog.workouts?.push(workoutLog);
    }

    programPlan.logs.weeksLog.push(weekLog);
  }
};
