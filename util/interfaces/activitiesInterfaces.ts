import { ObjectId } from 'bson';
import { IUserAuth } from './userInterfaces';

export interface IProgramPlan {
  _id?: ObjectId;
  program: IProgram;
  assignedTo: IUserAuth;
  assignedOn: Date;
  assignedBy: IUserAuth;
  weeksPlan?: IWeekPlan[];
  logs?: IProgramLog;
}

export interface IWeekPlan {
  _id?: ObjectId;
  weekNumber: number;
  workouts?: IWorkoutPlan[];
}
export interface IProgramLog {
  _id?: ObjectId;
  log: IStatusLog;
  weeksLog: IWeekLog[];
}

export interface IWeekLog {
  _id?: ObjectId;
  weekNumber: number;
  workouts?: IWorkoutLog[];
}

export interface IWorkoutLog {
  _id?: ObjectId;
  workout: IWorkout;
  dayNumber?: number;
  dayOfTheWeek?:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thrusday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  exercises: IExerciseLog[];
  log: IStatusLog;
}

export interface IExerciseLog {
  _id?: ObjectId;
  exercise: IExercise;
  log: IStatusLog;
  sets?: ISetLog[];
}

export interface ISetLog {
  _id?: ObjectId;
  log: IStatusLog;
  weight: number;
  reps: number;
  rir: number;
}

export interface IStatusLog {
  _id?: ObjectId;
  isStarted?: boolean;
  startedOn?: Date;
  isCompleted?: boolean;
  completedOn?: Date;
  isSkipped?: boolean;
  skippedOn?: Date;
  notes?: string;
}

export interface IProgram {
  _id?: ObjectId;
  name: string;
  description?: string;
  type: 'Strength' | 'Hypertrophy' | 'Endurance' | 'Mixed';
  sequence: 'Weekly' | 'Cycle';
  duration: number;
  linkToImage?: string;
  linkToThumbnail?: string;
  workouts?: IWorkoutPlan[];
}

export interface IWorkoutPlan {
  workout: IWorkout;
  dayNumber?: number;
  dayOfTheWeek?:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thrusday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
}

export interface IWorkout {
  _id?: ObjectId;
  name?: string;
  description?: string;
  variant?: string;
  type?: 'Strength' | 'Hypertrophy' | 'Endurance';
  target?:
    | 'Full Body'
    | 'Upper Body'
    | 'Lower Body'
    | 'Front Muscles'
    | 'Back Muscles'
    | 'Mixed';
  linkToImage?: string;
  linkToThumbnail?: string;
  exercises?: IExercisePlan[];
}

export interface IExercisePlan {
  _id?: ObjectId;
  exercise: IExercise;
  sets: number[];
  reps: number[];
  tempo?: number[];
  rir?: number[];
  rest: number[];
  superset: boolean;
  supersetExercise?: ObjectId | string;
}

export interface IExercise {
  _id?: ObjectId;
  name: string;
  alternativeName: string;
  difficulty: string;
  types: string[];
  compoundMovement: boolean;
  mainMuscle: IMuscle;
  secondaryMuscles: IMuscle[] | null;
  equipments: IEquipment[] | null;
  safeForConditions: IPhysicalCondition[] | null;
  notRecommendedForConditions: IPhysicalCondition[] | null;
  recommendedForCyclePhases: string[];
  linkToVideo: string;
  linkToImage: string;
  linkToThumbnail?: string;
}

export interface IMuscle {
  _id?: ObjectId;
  name: string;
  alternativeName: string;
  description?: string;
  type: string;
  linkToImage: string;
  linkToThumbnail?: string;
}

export interface IEquipment {
  _id?: ObjectId;
  name: string;
  alternativeName: string;
  description: string;
  linkToImage: string;
  linkToThumbnail?: string;
}

export interface IPhysicalCondition {
  _id?: ObjectId;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  tests: string[];
}
