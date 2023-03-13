import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import {
  IProgram,
  IWeekLog,
  IProgramPlan,
  IWorkoutLog,
  IStatusLog,
  IExerciseLog,
  ISetLog,
} from '../../util/interfaces/activitiesInterfaces';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import ProgramPlanHandler from '../../models/activitiesModels/programPlanModel';
import AppError from '../../util/errors/appError';
import { ObjectId } from 'mongodb';

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
  
  export const apiAddSetLog = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { programPlanId, weekId, workoutPlanId, exercisePlanId } = req.params;
      const paramVals = { programPlanId, weekId, workoutPlanId, exercisePlanId };
      req.body._id = new ObjectId();
  
      await ProgramPlanHandler.addSetLog(paramVals, req.body);
  
      res
        .status(RESPONSE_CODE.CREATED)
        .json(RESPONSE.ADDED_SUCCESSFULLY_ID(req.body._id));
    }
  );
  
  export const apiUpdateSetLog = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { programPlanId, weekId, workoutPlanId, exercisePlanId, setId } =
        req.params;
      const paramVals = {
        programPlanId,
        weekId,
        workoutPlanId,
        exercisePlanId,
        setId,
      };
      req.body._id = setId;
  
      await ProgramPlanHandler.updateSetLog(paramVals, req.body);
  
      res
        .status(RESPONSE_CODE.CREATED)
        .json(RESPONSE.UPDATED_SUCCESSFULLY_ID(req.body._id));
    }
  );
  
  export const apiDeleteSetLog = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { programPlanId, weekId, workoutPlanId, exercisePlanId, setId } =
        req.params;
      const paramVals = {
        programPlanId,
        weekId,
        workoutPlanId,
        exercisePlanId,
        setId,
      };
  
      await ProgramPlanHandler.deleteSetLog(paramVals);
  
      res
        .status(RESPONSE_CODE.CREATED)
        .json(RESPONSE.DELETED_SUCCESSFULLY_ID(paramVals.setId));
    }
  );

/** ADDITIONAL FUNCTIONS */
  /**** Program Logs  */
export const createProgramPlanLogs = (programPlan: IProgramPlan, program: IProgram) => {
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