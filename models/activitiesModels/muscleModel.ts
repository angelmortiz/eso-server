import { ObjectId } from 'bson';
import { IMuscle } from '../../util/interfaces/activitiesInterfaces';
import { ExerciseIdAndName, IdAndName } from '../../util/types/types';
import MuscleSchema from '../../util/database/schemas/activities/muscleSchema';
import mongoose from 'mongoose';

const MuscleModel = mongoose.model('activities.muscle', MuscleSchema);

export default class MuscleHandler implements IMuscle {
    id: ObjectId | string;
    name: string;
    alternativeName: string;
    type: string;
    exercises: ExerciseIdAndName[] | null;
    linkToImage: string;

    static _names: IdAndName[];

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }
    
    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    save() {
        return new MuscleModel(this)
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
      return MuscleModel
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
        return MuscleModel
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
        return MuscleModel
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
        return MuscleModel
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
        return MuscleModel
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
        return MuscleModel
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
        //forces to fetch all names if a new muscles has been added to the db
        if (objectId) {
          const index: number = this._names?.findIndex(obj => obj._id.toString() === objectId);
          if (index === -1) forceFetch = true;
        }
    
        //Only fetches names the first time or when it's forced
        if (!this._names || forceFetch) {
          await MuscleHandler.fetchAllNames().then(fetchedNames => this._names = fetchedNames);
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