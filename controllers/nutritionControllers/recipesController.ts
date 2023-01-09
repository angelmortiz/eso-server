import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { ConditionIdAndName, DietIdAndName, FoodIdAndName } from '../../util/types/types';
import { IRecipe } from '../../util/interfaces/nutritionInterfaces';
import RecipeHandler from '../../models/nutritionModels/recipeModel';
import FoodHandler from '../../models/nutritionModels/foodModel';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

/** APIS */
export const apiDeleteRecipe = (req: Request, res: Response) => {
  const recipeId: string = req.params.recipeId;

  RecipeHandler.deleteById(recipeId)
  .then( deleteResponse => {
    //removes the recipe from recipes dropdown
    //removes the food from foods dropdown
    RecipeHandler.removeNameById(recipeId);
    console.log(`'${deleteResponse.name}' recipe deleted successfully.`);
    res.redirect(`/nutrition/recipe/`);
  })
  .catch(err => {
    console.log('Error while deleting Recipe: ', err);
  });
};

/*** FUNCTIONS */
const refactorValuesForDb = async (recipe: RecipeHandler) => {
  recipe = refactorMealTypeValues(recipe);
  recipe.ingredients = await refactorIngredients(recipe.ingredients);
  recipe.instructions = removeEmptyValues(recipe.instructions);
  recipe.utensils = removeEmptyValues(recipe.utensils);
  recipe.safeForConditions = await refactorChronicConditions(recipe.safeForConditions);
  recipe.notRecommendedForConditions = await refactorChronicConditions(recipe.notRecommendedForConditions);
  recipe.compatibleWithDiets = await refactorCompatibleWithDiets(recipe.compatibleWithDiets);
  recipe.recommendedForCyclePhases = refactorCyclePhases(recipe.recommendedForCyclePhases);
  return recipe;
};

const refactorIngredients = async (ingredients)  => {
  if (!ingredients){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(ingredients) === 'string') {
    ingredients = [ingredients]; 
  }

  const _foodNames = await FoodHandler.getAllNames();

  let refactoredFoods: FoodIdAndName[] = [];
  ingredients.forEach(foodId => 
    {
      if (!foodId) return; //skips empty selections

      const foodObject: FoodIdAndName = {
        foodId: new ObjectId(foodId),
        foodName: _foodNames.find(
          f => f._id.toString() === foodId.toString())?.name || 'Nombre no disponible'
      };

      refactoredFoods.push(foodObject);
    });
  
  return refactoredFoods;
};

const removeEmptyValues = (values: string[]): string[] => {
  if (!values) return [];

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(values) === 'string')
  {
    values = [values];
  }

  //removes all empty options if necessary.
  return values.filter(v => v);
}

const refactorMealTypeValues = (recipe) => {
  recipe.mealType = [];

  if (recipe.breakfast) {
    recipe.mealType.push('Desayuno');
    delete recipe.breakfast;
  }
  if (recipe.lunch) {
    recipe.mealType.push('Almuerzo');
    delete recipe.lunch;
  }
  if (recipe.dinner) {
    recipe.mealType.push('Cena');
    delete recipe.dinner;
  }

  return recipe;
};

const refactorChronicConditions = async (selectedConditions) => {
  if (!selectedConditions){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedConditions) === 'string') {
    selectedConditions = [selectedConditions]; 
  }
  //Fetches all the chronic conditions to pair with their names
  const _conditionNames = await ChronicConditionHandler.getAllNames();

  let refactoredConditions: ConditionIdAndName[] = [];
  selectedConditions.forEach(conditionId => 
    {
      if (!conditionId) return; //skips empty selections

      const conditionObject: ConditionIdAndName = {
        conditionId: new ObjectId(conditionId),
        conditionName: _conditionNames.find(
          c => c._id.toString() === conditionId.toString())?.name || 'Nombre no disponible'
      };

      refactoredConditions.push(conditionObject);
    });
  
  return refactoredConditions;
};

const refactorCompatibleWithDiets = async (selectedDietsCompatible) => {
  if (!selectedDietsCompatible) {return null;}

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedDietsCompatible) === 'string') {
    selectedDietsCompatible = [selectedDietsCompatible]; 
  }
  //Fetches all the diets to pair with their names
  const _dietNames = await DietHandler.getAllNames();

  let refactoredDiets: DietIdAndName[] = [];
  selectedDietsCompatible.forEach(dietId => 
    {
      if (!dietId) return; //skips empty selections

      const dietObject: DietIdAndName = {
        dietId: new ObjectId(dietId),
        dietName: _dietNames.find(
          d => d._id.toString() === dietId.toString())?.name || 'Nombre no disponible'
      };

      refactoredDiets.push(dietObject);
    });
  
  return refactoredDiets;

};

const refactorCyclePhases = (selectedPhases) => {
  if (!selectedPhases) { return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedPhases) === 'string')
  {
    selectedPhases = [selectedPhases];
  }
  
  //removes all empty options if necessary.
  return selectedPhases.filter(p => p);
};