import { ObjectId } from 'bson';
import { IFood } from "../../util/interfaces/nutritionInterfaces";
import { ConditionIdAndName, DietIdAndName, IdAndName } from '../../util/types/types';
import FoodSchema from '../../util/database/schemas/nutrition/foodSchema';
import mongoose from 'mongoose';

const FoodModel = mongoose.model('nutrition.food', FoodSchema);

export default class FoodHandler implements IFood {
  id: ObjectId | string;
  name: string;
  classification: string;
  description: string;
  mainMacronutrient: string;
  secondaryMacronutrient: string;
  nutritionFacts: object;
  mealType: string[];
  micronutrientDensity: string;
  safeForConditions: ConditionIdAndName[] | null;
  notRecommendedForConditions: ConditionIdAndName[] | null;
  recommendedForCyclePhases: string[] | null;
  compatibleWithDiets: DietIdAndName[] | null;
  linkToImage: string;

  static _names: IdAndName[];

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, do not map
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  save() {
    return new FoodModel(this)
    .save()
    .then((result) => {
      console.log('New document inserted successfully.');
      return result._id.toString();
    })
    .catch((error) => {
      console.log('There was an error trying to insert new document.', error);
      return error;
    });
  }

  update() {
    return FoodModel
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
    return FoodModel
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
    return FoodModel
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
    return FoodModel
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
  static fetchAllNames() {
    return FoodModel
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
    return FoodModel
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
      await FoodHandler.fetchAllNames().then(fetchedNames => this._names = fetchedNames);
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

  static foodSelectOptions = {
    classification: ['Vegetal', 'Fruta', 'Carne', 'Especie', 'Bebida'],
    macronutrients: ['Proteína', 'Grasa', 'Carbohidrato'],
    micronutrientDensity: ['Bajo', 'Medio', 'Alto']
  }
};