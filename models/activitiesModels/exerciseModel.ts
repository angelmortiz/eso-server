import { ObjectId } from "bson";
import { IExercise } from "../../util/interfaces/activitiesInterfaces";
import { ConditionIdAndName } from "../../util/types/types";

const exercises: IExercise[] = [];

export default class Exercise implements IExercise{
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

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        exercises.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return exercises.find(f => f.name === name);
    }

    static fetchById(id) {
        return exercises.find(f => f.id === id);
    }

    static fetchAll() {
        return exercises;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return exercises.map(f => ({id: f.id, name: f.name}));
    }
};