import { ObjectId } from 'bson';
import { activitiesDb } from '../../util/database/connection';
import { IPhysicalCondition } from '../../util/interfaces/activitiesInterfaces';
import PhysicalConditionSchema from '../../util/database/schemas/activities/physicalConditionSchema';

const PhysicalConditionModel = activitiesDb.model('PhysicalCondition', PhysicalConditionSchema);

export default class PhysicalConditionHandler implements IPhysicalCondition {
    id: ObjectId | string;
    name: string;
    description: string;
    symptoms: string[];
    causes: string[];
    treatments: string[];
    tests: string[];

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }
    
    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    save() {
        return new PhysicalConditionModel(this)
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
      return PhysicalConditionModel
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
        return PhysicalConditionModel
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
        return PhysicalConditionModel
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
        return PhysicalConditionModel
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
        return PhysicalConditionModel
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
        return PhysicalConditionModel
        .findByIdAndDelete(id)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
      }

    static physicalConditionsStaticValues = {
        //TODO: DELETE ME AND FETCH FROM DB
        physicalConditions: [
          {_id: "", name: "-- Elige --"},
          {_id: "62e3fd6e2aeacf742c28845f", name: "Dolor de espalda baja"},
          {_id: "62e3fd6e2aeacf742c28845e", name: "Dolor en la cadera"}
        ]
    }
};