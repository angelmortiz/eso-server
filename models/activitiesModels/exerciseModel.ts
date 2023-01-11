import { ObjectId } from "bson";
import { IExercise } from "../../util/interfaces/activitiesInterfaces";
import { ConditionIdAndName, EquipmentIdAndName, IdAndName, MuscleIdAndName } from "../../util/types/types";
import ExerciseSchema from '../../util/database/schemas/activities/exerciseSchema';
import mongoose from "mongoose";

const ExerciseModel = mongoose.model('Exercise', ExerciseSchema);

export default class ExerciseHandler implements IExercise {
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

    static _names: IdAndName[]; //IMPROVE: Use a better caching data strategy to cache the names of the exercises 

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

      static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
        //forces to fetch all names if a new exercises has been added to the db
        if (objectId) {
          const index: number = this._names?.findIndex(obj => obj._id.toString() === objectId);
          if (index === -1) forceFetch = true;
        }
    
        //Only fetches names the first time or when it's forced
        if (!this._names || forceFetch) {
          await ExerciseHandler.fetchAllNames().then(fetchedNames => this._names = fetchedNames);
        }
    
        return this._names;
      } 
    
      //removes exericse from the list of names once it's been deleted
      static removeNameById(objectId: string){
        const index: number = this._names?.findIndex(obj => obj._id.toString() === objectId);
        if (index > -1){
          this._names.splice(index, 1);
        }
      }

    static exercisesStaticValues = {
        types: [
            {_id: "Fuerza", name: "Fuerza"},
            {_id: "Cardio", name: "Cardio"},
            {_id: "HIIT", name: "HIIT"},
            {_id: "Estiramiento", name: "Estiramiento"}
        ]
    }
};