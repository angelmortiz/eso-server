import { ObjectId } from 'bson';
import { IFood } from "../../util/interfaces/nutritionInterfaces";
import { ConditionIdAndName, DietIdAndName, IdAndName } from '../../util/types/types';
import FoodSchema from '../../util/database/schemas/nutrition/foodSchema';
import mongoose from 'mongoose';

const FoodModel = mongoose.model('Food', FoodSchema);

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

  async save() {
    return await new FoodModel(this).save();
  }

  async update() {
    return await FoodModel.updateOne({ _id: this.id }, this, {runValidators: true});
  }

  static async fetchById(id: string | ObjectId) {
    return await FoodModel.findById(id);
  }

  static async fetchAll() {
    return await FoodModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await FoodModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await FoodModel.findByIdAndDelete(id);
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