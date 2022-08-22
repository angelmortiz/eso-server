import { ObjectId } from "bson";
import { activitiesDb } from '../../util/database/connection';
import { IExercise } from "../../util/interfaces/activitiesInterfaces";
import { ConditionIdAndName, EquipmentIdAndName, MuscleIdAndName } from "../../util/types/types";
import ExerciseSchema from '../../util/database/schemas/activities/exerciseSchema';

const ExerciseModel = activitiesDb.model('Exercise', ExerciseSchema);

export default class Exercise implements IExercise {
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

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }
    
    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    save() {
        return new ExerciseModel(this)
        .save()
        .then((response) => {
            console.log('New document inserted successfully.');
            return response._id.toString();
        })
        .catch((error) => {
            console.log('There was an error trying to insert new document.', error);
            return error;
        });
    }

    update() {
      return ExerciseModel
      .updateOne({_id: this.id}, this)
      .then((result) => {
        console.log('Document updated successfully.', result);
        return result;
      })
      .catch((error) => {
        console.log('There was an error trying to update the document.', error);
        return error;
      });
    }

    static fetchByName(name: string) {
        return ExerciseModel
        .findOne({name: name})
        .then((response) => {
        return response;
        })
        .catch((error) => {
        console.log(error);
        return error;
        });
    }

    static fetchById(id: string | ObjectId) {
        return ExerciseModel
        .findById(id)
        .then((response) => {
        return response;
        })
        .catch((error) => {
        console.log(error);
        return error;
        });
    }

    static fetchAll() {
        return ExerciseModel
        .find()
        .then((responses) => {
        return responses;
        })
        .catch((error) => {
        console.log(error);
        return error;
        });
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return ExerciseModel
        .find({}, 'name')
        .then((responses) => {
          return responses;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }

    static deleteById(id: string | ObjectId) {
        return ExerciseModel
        .findByIdAndDelete(id)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
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