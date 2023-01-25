import { ObjectId } from 'bson';
import { ConditionIdAndName, EquipmentIdAndName, 
        ExerciseIdAndName, MuscleIdAndName } from '../types/types';

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