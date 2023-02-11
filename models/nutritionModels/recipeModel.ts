import { ObjectId } from 'bson';
import { IRecipe } from '../../util/interfaces/nutritionInterfaces';
import {
  ConditionIdAndName,
  DietIdAndName,
  FoodIdAndName,
  IdAndName,
} from '../../util/types/types';
import RecipeSchema from '../../util/database/schemas/nutrition/recipeSchema';
import mongoose from 'mongoose';

const RecipeModel = mongoose.model('Recipe', RecipeSchema);

export default class RecipeHandler implements IRecipe {
  id: ObjectId | string;
  name: string;
  description: string;
  preparationTime: number;
  complexity: string;
  source: string;
  mealType: string[];
  ingredients: FoodIdAndName[] | null;
  instructions: string[];
  utensils: string[];
  nutritionFacts: string[];
  safeForConditions: ConditionIdAndName[] | null;
  notRecommendedForConditions: ConditionIdAndName[] | null;
  recommendedForCyclePhases: string[] | null;
  compatibleWithDiets: DietIdAndName[] | null;
  linkToImage: string;
  linkToVideo: string;

  static _names: IdAndName[];

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, ignore the rest of the logic
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new RecipeModel(this).save();
  }

  async update() {
    return await RecipeModel.updateOne({ _id: this.id }, this, {runValidators: true});
  }

  static async fetchById(id: string | ObjectId) {
    return await RecipeModel.findById(id);
  }

  static async fetchAll() {
    return await RecipeModel.find();
  }

  //extracts id and name properties and creates a new object with {id, name}
  static async fetchAllNames() {
    return await RecipeModel.find({}, 'name');
  }

  static async deleteById(id: string | ObjectId) {
    return await RecipeModel.findByIdAndDelete(id);
  }

  static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
    //forces to fetch all names if a new recipe has been added to the db
    if (objectId) {
      const index: number = this._names?.findIndex(
        (obj) => obj._id.toString() === objectId
      );
      if (index === -1) forceFetch = true;
    }

    //Only fetches names the first time or when it's forced
    if (!this._names || forceFetch) {
      await RecipeHandler.fetchAllNames().then(
        (fetchedNames) => (this._names = fetchedNames)
      );
    }

    return this._names;
  }

  //removes food from the list of names once it's been deleted
  static removeNameById(objectId: string) {
    const index: number = this._names?.findIndex(
      (obj) => obj._id.toString() === objectId
    );
    if (index > -1) {
      this._names.splice(index, 1);
    }
  }

  static recipeStaticValues = {
    complexity: ['Baja', 'Media', 'Alta'],
  };
}
