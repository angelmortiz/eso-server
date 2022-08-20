import { ObjectId } from "bson";
import { IRecipe } from "../../util/interfaces/nutritionInterfaces";
import { ConditionIdAndName, DietnIdAndName } from "../../util/types/nutritionTypes";

const recipes: IRecipe[] = [];

export default class Recipe implements IRecipe {
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
    safeForConditions: ConditionIdAndName[];
    notRecommendedForConditions: ConditionIdAndName[];
    recommendedForCyclePhases: string[];
    compatibleWithDiets: DietnIdAndName[];
    linkToImage: string;
    linkToVideo: string;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        recipes.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name: string) {
        return recipes.find(f => f.name === name);
    }

    static fetchById(id: string) {
        return recipes.find(f => f.id === id);
    }

    static fetchAll() {
        return recipes;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return recipes.map(f => ({id: f.id, name: f.name}));
    }
};