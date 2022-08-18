import { ObjectId } from 'bson';
import { ConditionIdAndName } from '../types/nutritionTypes';

export interface IExercise {
    id: ObjectId | string;
    name: string;
    alternativeName: string;
    difficulty: string;
    types: string[];
    compundMovement: boolean;
    mainMuscle: string;
    secondaryMuscles: string[];
    equipments: any[];
    safeForConditions: ConditionIdAndName[];
    notRecommendedForConditions: ConditionIdAndName[];
    recommendedForCyclePhases: string[];
    linkToVideo: string;
}

export interface IMuscle {
    id: ObjectId | string;
    name: string;
    alternativeName: string;
    type: string;
    linkToImage: string;
}

export interface IEquipment {
    id: ObjectId | string;
    name: string;
    alternativeName: string;
    description: string;
    exercises: any[];
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