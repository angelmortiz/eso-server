import { ObjectId } from "bson";
import { IRecipe } from "../../util/interfaces/nutritionInterfaces";
import { nutritionDb } from '../../util/database/connection';
import { ConditionIdAndName, DietIdAndName, FoodIdAndName, IdAndName } from '../../util/types/types';
import RecipeSchema from '../../util/database/schemas/nutrition/recipeSchema';

const RecipeModel = nutritionDb.model('Recipe', RecipeSchema);

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

      static async getAllNames(objectId: string = '', forceFetch: boolean = false) {
        //forces to fetch all names if a new recipe has been added to the db
        if (objectId) {
          const index: number = this._names?.findIndex(obj => obj._id.toString() == objectId);
          if (index === -1) forceFetch = true;
        }
    
        //Only fetches names the first time or when it's forced
        if (!this._names || forceFetch) { 
          await RecipeHandler.fetchAllNames().then(fetchedNames => this._names = fetchedNames);
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

      static recipeStaticValues = {
        complexity: ['Baja', 'Media', 'Alta']
      }
};