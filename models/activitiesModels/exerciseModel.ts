import { ObjectId } from "bson";
import { IExercise } from "../../util/interfaces/activitiesInterfaces";
import { ConditionIdAndName, EquipmentIdAndName, MuscleIdAndName } from "../../util/types/types";

const exercises: IExercise[] = [];

export default class Exercise implements IExercise {
    id: ObjectId | string;
    name: string;
    alternativeName: string;
    difficulty: string;
    types: string[];
    compundMovement: boolean;
    mainMuscle: MuscleIdAndName;
    secondaryMuscles: MuscleIdAndName[];
    equipments: EquipmentIdAndName[];
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

    static exercisesStaticValues = {
        //TODO: DELETE ME AND FETCH FROM DB
        exercises: [
          {_id: "", name: "-- Elige --"},
          {_id: "62e3fb672aeacf742c288451", name: "Sentadillas"},
          {_id: "62e3fb672aeacf742c288452", name: "Deadlifts"}
        ],
        types: [
            {_id: "", name: "-- Elige --"},
            {_id: "Fuerza", name: "Fuerza"},
            {_id: "Cardio", name: "Cardio"},
            {_id: "HIIT", name: "HIIT"},
            {_id: "Estiramiento", name: "Estiramiento"}
        ]
    }
};