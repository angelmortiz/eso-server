import { ObjectId } from 'bson';
import { ConditionIdAndName, DietIdAndName, FoodIdAndName } from '../types/types';

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
    compatibleWithDiets: DietIdAndName[] | null;
    linkToImage: string;
    linkToThumbnail?: string;
}

export interface IRecipe {
    id: ObjectId | string;
    name: string;
    description: string;
    preparationTime: number;
    complexity: string;
    source: string;
    mealType: string[];
    ingredients: FoodIdAndName[] | null;
    instructions: string[];
    utensils: string[];
    nutritionFacts: string[];
    safeForConditions: ConditionIdAndName[] | null;
    notRecommendedForConditions: ConditionIdAndName[] | null;
    recommendedForCyclePhases: string[] | null;
    compatibleWithDiets: DietIdAndName[] | null;
    linkToImage: string;
    linkToThumbnail?: string;
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