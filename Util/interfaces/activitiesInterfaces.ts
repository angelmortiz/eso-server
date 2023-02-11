import { ObjectId } from 'bson';
import { IUserAuth } from './userInterfaces';

export interface IProgramPlan {
  id?: ObjectId | string;
  program: IProgram;
  assignedTo: IUserAuth;
  assignedOn: Date;
  assignedBy: IUserAuth;
  weeksPlan?: IWeekPlan[];
}

export interface IWeekPlan {
  weekNumber: number;
  workouts?: IWorkoutPlan[];
}

export interface IProgram {
  id: ObjectId | string;
  name: string;
  description?: string;
  type: 'Strength' | 'Hypertrophy' | 'Endurance' | 'Mixed';
  sequence: 'Weekly' | 'Cycle';
  duration: number;
  linkToImage?: string;
  workouts?: IWorkoutPlan[];
}

export interface IWorkoutPlan {
  id?: ObjectId | string;
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
  id: ObjectId | string;
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
  exercises?: IExercisePlan[];
}

export interface IExercise {
  id: ObjectId | string;
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
}

export interface IExercisePlan {
  id: ObjectId | string;
  exercise: IExercise;
  sets: number[];
  reps: number[];
  tempo?: number[];
  rir?: number[];
  rest: number[];
  superset: boolean;
  supersetExercise?: ObjectId | string;
}

export interface IMuscle {
  id: ObjectId | string;
  name: string;
  alternativeName: string;
  type: string;
  linkToImage: string;
}

export interface IEquipment {
  name: string;
  alternativeName: string;
  description: string;
  linkToImage: string;
}

export interface IPhysicalCondition {
  id: ObjectId | string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  tests: string[];
}
