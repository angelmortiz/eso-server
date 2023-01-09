import { ObjectId } from "bson";
import { IDiet } from "../../util/interfaces/nutritionInterfaces";
import { ConditionIdAndName, IdAndName } from "../../util/types/types";
import DietSchema from '../../util/database/schemas/nutrition/dietSchema';
import mongoose from "mongoose";

const DietModel = mongoose.model('Diet', DietSchema);

export default class DietHandler implements IDiet {
    id: ObjectId | string;
    name: string;
    officialName: string;
    description: string;
    safeForConditions: ConditionIdAndName[] | null;

    static _names: IdAndName[];
    
    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }
    
    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    save() {
        return new DietModel(this)
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
      return DietModel
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
        return DietModel
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
        return DietModel
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
        return DietModel
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
        return DietModel
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
        return DietModel
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
      //forces to fetch all names if a new food has been added to the db
      if (objectId) {
        const index: number = this._names?.findIndex(obj => obj._id.toString() === objectId);
        if (index === -1) forceFetch = true;
      }
  
      //Only fetches names the first time or when it's forced
      if (!this._names || forceFetch) {
        await DietHandler.fetchAllNames().then(fetchedNames => this._names = fetchedNames);
      }
  
      return this._names;
    }
  
    //removes food from the list of names once it's been deleted
    static removeNameById(objectId: string){
      const index: number = this._names?.findIndex(obj => obj._id.toString() === objectId);
      if (index > -1){
        this._names.splice(index, 1);
      }
    }
};