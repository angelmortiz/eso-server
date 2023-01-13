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

    async save() {
      return await new ExerciseModel(this).save();
    }

    async update() {
      return await ExerciseModel.updateOne({_id: this.id}, this);
    }

    static async fetchByName(name: string) {
      return await ExerciseModel.findOne({name: name});
    }

    static async fetchById(id: string | ObjectId) {
      return await ExerciseModel.findById(id);
    }

    static async fetchAll() {
      return await ExerciseModel.find();
    }

    //extracts id and name properties and creates a new object with {id, name}
    static async fetchAllNames()  {
      return await ExerciseModel.find({}, 'name');
    }

    static async deleteById(id: string | ObjectId) {
      return await ExerciseModel.findByIdAndDelete(id);
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
    static async removeNameById(objectId: string) {
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