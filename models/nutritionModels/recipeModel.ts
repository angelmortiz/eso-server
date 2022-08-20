import { ObjectId } from "bson";
import { IRecipe } from "../../util/interfaces/nutritionInterfaces";
import { nutritionDb } from '../../util/database/connection';
import { ConditionIdAndName, DietnIdAndName, FoodIdAndName } from '../../util/types/types';
import RecipeSchema from '../../util/database/schemas/nutrition/recipeSchema';

const RecipeModel = nutritionDb.model('Recipe', RecipeSchema);

export default class Recipe implements IRecipe {
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
    compatibleWithDiets: DietnIdAndName[] | null;
    linkToImage: string;
    linkToVideo: string;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    save() {
        return new RecipeModel(this)
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
        return RecipeModel
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
        return RecipeModel
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
        return RecipeModel
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
        return RecipeModel
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
        return RecipeModel
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
        return RecipeModel
        .findByIdAndDelete(id)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
      }

      static recipeSelectOptions = {
        complexity: ['Baja', 'Media', 'Alta']
      }
};