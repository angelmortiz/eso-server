import { ObjectId } from 'bson';
import { ConditionIdAndName, DietnIdAndName } from '../types/nutritionTypes';

export interface IFood {
    id: ObjectId | string;
    name: string;
    classification: string;
    description: string;
    mainMacronutrient: string;
    secondaryMacronutrient: string;
    nutritionFacts: object;
    mealType: string[];
    micronutrientDensity: string;
    safeForConditions: ConditionIdAndName[] | null;
    notRecommendedForConditions: ConditionIdAndName[] | null;
    recommendedForCyclePhases: string[] | null;
    compatibleWithDiets: DietnIdAndName[] | null;
    linkToImage: string;
}

export interface IRecipe {
    id: ObjectId | string;
    name: string;
    description: string;
    preparationTime: number;
    complexity: string;
    mealType: string[];
    ingredients: string[];
    instructions: string[];
    source: string;
    utensils: string[];
    nutritionFacts: string[];
    safeForConditions: ConditionIdAndName[] | null;
    notRecommendedForConditions: ConditionIdAndName[] | null;
    recommendedForCyclePhases: string[] | null;
    compatibleWithDiets: DietnIdAndName[] | null;
    linkToImage: string;
    linkToVideo: string;
}

export interface IDiet {
    id: ObjectId | string;
    name: string;
    officialName: string;
    description: string;
    safeForConditions: ConditionIdAndName[] | null;
}

export interface IChronicCondition {
    id: ObjectId | string;
    name: string;
    description: string;
    symptoms: string[];
    causes: string[];
    treatments: string[];
    tests: string[];
}