import { ObjectId } from 'bson';
import { nutritionDb } from '../../util/database/connection';
import { IChronicCondition } from '../../util/interfaces/nutritionInterfaces';
import ChronicConditionSchema from '../../util/database/schemas/nutrition/chronicConditionSchema';
import { IdAndName } from '../../util/types/types';

const ChronicConditionModel = nutritionDb.model('ChronicCondition', ChronicConditionSchema);

export default class ChronicConditionHandler implements IChronicCondition {
    id: ObjectId | string;
    name: string;
    description: string;
    symptoms: string[];
    causes: string[];
    treatments: string[];
    tests: string[];

    static _names: IdAndName[];

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }
    
    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    save() {
        return new ChronicConditionModel(this)
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
      return ChronicConditionModel
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
        return ChronicConditionModel
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
        return ChronicConditionModel
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
        return ChronicConditionModel
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
        return ChronicConditionModel
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
        return ChronicConditionModel
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
      //forces to fetch all names if a new conditions has been added to the db
      if (objectId) {
        const index: number = this._names?.findIndex(obj => obj._id.toString() == objectId);
        if (index === -1) forceFetch = true;
      }
  
      //Only fetches names the first time or when it's forced
      if (!this._names || forceFetch) {
        await ChronicConditionHandler.fetchAllNames().then(fetchedNames => this._names = fetchedNames);
      }
  
      return this._names;
    } 
  
    //removes food from the list of names once it's been deleted
    static removeNameById(objectId: string){
      const index: number = this._names?.findIndex(obj => obj._id.toString() == objectId);
      if (index > -1){
        this._names.splice(index, 1);
      }
    }
};
