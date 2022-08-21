import { ObjectId } from 'bson';
import { activitiesDb } from '../../util/database/connection';
import { IMuscle } from '../../util/interfaces/activitiesInterfaces';
import { ExerciseIdAndName } from '../../util/types/types';
import MuscleSchema from '../../util/database/schemas/activities/muscleSchema';

const MuscleModel = activitiesDb.model('Muscle', MuscleSchema);

export default class Muscle implements IMuscle {
    id: ObjectId | string;
    name: string;
    alternativeName: string;
    type: string;
    exercises: ExerciseIdAndName[] | null;
    linkToImage: string;

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

    static musclesStaticValues = {
        //TODO: DELETE ME AND FETCH FROM DB
        muscles: [
          {_id: "", name: "-- Elige --"},
          {_id: "62e3fd1e2aeacf742c28845c", name: "Cuádriceps"},
          {_id: "62e3fd1e2aeacf742c28845d", name: "Hamstrings"}
        ] 
    };
};