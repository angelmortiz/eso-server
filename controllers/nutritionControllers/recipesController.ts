import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { IdAndName } from '../../util/types/nutritionTypes';
import RecipeHandler from '../../models/nutritionModels/recipeModel';
import FoodHandler from '../../models/nutritionModels/foodModel';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

let _recipeNames: IdAndName[] = [];
let _foodNames: IdAndName[] = [];
let _conditionNames: IdAndName[] = [];
let _dietNames: IdAndName[] = [];

export const getRecipe = (req: Request, res: Response) => {
  res.render('./nutrition/view-recipe', {
    caller: 'view-recipe',
    pageTitle: 'Información de receta',
  });
};

export const getAddRecipe = (req: Request, res: Response) => {
  res.render('./nutrition/add-recipe', {
    caller: 'add-recipe',
    pageTitle: 'Añadir receta',
  });
};

export const getViewToAddRecipe = async (req: Request, res: Response) => {
  //Fetches the recipeNames from db if for some reason the data was lost from previous method
  await fetchRecipeNames();

  res.render('./nutrition/add-recipe', {
    caller: 'add-recipe',
    pageTitle: 'Añadir receta',
    recipeNames: _recipeNames,
    selectedRecipeInfo: null,
    ingredients: FoodHandler.foodStaticValues.foods,
    chronicConditions: ChronicConditionHandler.chronicConditionsStaticValues.chronicConditions,
    diets: DietHandler.compatibleWithDietsStaticValues.diets,
    menstrualCyclePhases: MenstrualCyclePhaseHandler.menstrualCyclePhasesStaticValues.menstrualCyclePhases
  });
};

/** ACTIONS */
export const addRecipe = (request) => {
  const recipe = new RecipeHandler(request.body);
  recipe.save();
  console.log(RecipeHandler.fetchAll());
  // res.redirect('/nutrition/recipe')
};

/*** FUNCTIONS */
const fetchRecipeNames = async (forceFetch = false) => {
  //Fetches the recipeNames from db only when recipeNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_recipeNames || _recipeNames.length === 0) {
    await RecipeHandler.fetchAllNames().then((recipeNames) => { _recipeNames = recipeNames});
  }
};