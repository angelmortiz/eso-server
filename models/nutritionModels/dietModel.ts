import { ObjectId } from "bson";
import { nutritionDb } from "../../util/database/connection";
import { IDiet } from "../../util/interfaces/nutritionInterfaces";
import { ConditionIdAndName } from "../../util/types/nutritionTypes";
import DietSchema from '../../util/database/schemas/nutrition/dietSchema';

const DietModel = nutritionDb.model('Diet', DietSchema);

export default class Diet implements IDiet {
    id: ObjectId | string;
    name: string;
    officialName: string;
    description: string;
    safeForConditions: ConditionIdAndName;

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

    static compatibleWithDietsStaticValues = {
        //TODO: DELETE ME AND FETCH FROM DB
        diets: [
          {_id: "", name: "-- Elige --"},
          {_id: "62e3f8da2aeacf742c28842b", name: "Keto"},
          {_id: "62e3f9a62aeacf742c28842c", name: "Paleo"}
        ]
    }
};