import { ObjectId } from 'bson';
import {
  ConditionIdAndName,
  EquipmentIdAndName,
  ExerciseIdAndName,
  MuscleIdAndName,
} from '../types/types';

export interface IProgramHistory {
  id: ObjectId | string;
  programId: ObjectId | string;
  assignedTo: ObjectId | string;
  assignedOn: Date;
  assignedBy: ObjectId | string;
  isStarted: boolean;
  startedOn?: Date;
  isCompleted: boolean;
  completedOn?: Date;
  workoutLogs?: IWorkoutLogs[];
}

export interface IWorkoutLogs {
  workoutId: ObjectId | string;
  isStarted: boolean;
  startedOn?: Date;
  isCompleted: boolean;
  completedOn?: Date;
  notes?: string;
  exercises?: IExerciseLogs[];
}

interface IExerciseLogs {
  exerciseId: ObjectId | string;
  isStarted: boolean;
  startedOn?: Date;
  isCompleted: boolean;
  completedOn?: Date;
  notes?: string;
  sets?: ISetLogs[];
}

interface ISetLogs {
  setNumber: number;
  weight: number;
  reps: number;
  rir?: number;
  isStarted: boolean;
  startedOn?: Date;
  isCompleted: boolean;
  completedOn?: Date;
}

export interface IProgram {
  id: ObjectId | string;
  name: string;
  description?: string;
  type: 'Strength' | 'Hypertrophy' | 'Endurance' | 'Mixed';
  sequence: 'Weekly' | 'Cycle';
  duration: number;
  linkToImage?: string;
  workouts?: IProgramPlan[];
}

export interface IProgramPlan {
  id: ObjectId | string;
  name: string;
  workoutId: ObjectId | string;
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
  name: string;
  description?: string;
  variant?: string;
  type: 'Strength' | 'Hypertrophy' | 'Endurance';
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

export interface IExercisePlan {
  id: ObjectId | string;
  name: string;
  exerciseId: ObjectId | string;
  sets: number[];
  reps: number[];
  tempo?: number[];
  rir?: number[];
  rest: number[];
  superset: boolean;
  supersetExercise?: ObjectId | string;
}

export interface IExercise {
  id: ObjectId | string;
  name: string;
  alternativeName: string;
  difficulty: string;
  types: string[];
  compoundMovement: boolean;
  mainMuscle: MuscleIdAndName | null;
  secondaryMuscles: MuscleIdAndName[] | null;
  equipments: EquipmentIdAndName[] | null;
  safeForConditions: ConditionIdAndName[] | null;
  notRecommendedForConditions: ConditionIdAndName[] | null;
  recommendedForCyclePhases: string[];
  linkToVideo: string;
  linkToImage: string;
}

export interface IMuscle {
  id: ObjectId | string;
  name: string;
  alternativeName: string;
  type: string;
  exercises: ExerciseIdAndName[] | null;
  linkToImage: string;
}

export interface IEquipment {
  id: ObjectId | string;
  name: string;
  alternativeName: string;
  description: string;
  exercises: ExerciseIdAndName[] | null;
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
