import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { ConditionIdAndName, DietIdAndName, FoodIdAndName, IdAndName } from '../../util/types/types';
import RecipeHandler from '../../models/nutritionModels/recipeModel';
import FoodHandler from '../../models/nutritionModels/foodModel';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

let _recipeNames: IdAndName[] = [];
let _foodNames: IdAndName[] = [];
let _conditionNames: IdAndName[] = [];
let _dietNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddRecipe = (req: Request, res: Response) => {
  res.redirect(`/nutrition/add-recipe`);
}

export const redirectToViewSelectedRecipe = (req: Request, res: Response) => {
  res.redirect(`/nutrition/recipe/${req.body.selectedRecipe}`);
}

export const getViewToSelectedRecipe = async (req: Request, res: Response) => {
  const selectedRecipeId: string = req.params.recipeId;
  
  //Fetches the recipeNames from db if names don't exist or if the current recipeId doesn't exist in array
  //Note: This logic is needed to fetch the new recipe info once a new recipe has been added to the db
  const index: number = _recipeNames?.findIndex(f => f._id.toString() == selectedRecipeId);
  (index > -1) ? await fetchRecipeNames(false) : await fetchRecipeNames(true);

  RecipeHandler.fetchById(selectedRecipeId)
  .then((selectedRecipeInfo) => {
    res.render('./nutrition/view-recipe', {
      caller: 'view-recipe',
      pageTitle: 'Información de receta',
      recipeNames: _recipeNames,
      selectedRecipeInfo: selectedRecipeInfo,
      recipeStaticValues: RecipeHandler.recipeStaticValues,
      ingredients: FoodHandler.foodStaticValues.foods,
      chronicConditions: ChronicConditionHandler.chronicConditionsStaticValues.chronicConditions,
      diets: DietHandler.compatibleWithDietsStaticValues.diets,
      menstrualCyclePhases: MenstrualCyclePhaseHandler.menstrualCyclePhasesStaticValues.menstrualCyclePhases
    });
  })
  .catch((err) => {
    console.log(err);
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
export const addRecipe = (req: Request, res: Response) => {
  let recipeHandler = new RecipeHandler(req.body);
  recipeHandler = refactorValuesForDb(recipeHandler);
  recipeHandler.save().then( id => res.redirect(`/nutrition/recipe/${id}`) );
};

export const updateRecipe = (req: Request, res: Response) => {
  const recipeId: string = req.params.recipeId;
  let recipe = new RecipeHandler(req.body);
  recipe.id = recipeId;
  recipe = refactorValuesForDb(recipe);
  
  recipe.update()
  .then(() => {
    res.redirect(`/nutrition/recipe/${recipeId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiDeleteRecipe = (req: Request, res: Response) => {
  const recipeId: string = req.params.recipeId;

  RecipeHandler.deleteById(recipeId)
  .then( deleteResponse => {
    //removes the recipe from recipes dropdown
    const index: number = _recipeNames?.findIndex(f => f._id.toString() == recipeId);
    if (index > -1){
      _recipeNames.splice(index, 1);
    }

    console.log(`'${deleteResponse.name}' recipe deleted successfully.`);

    res.redirect(`/nutrition/recipe/`);
  })
  .catch(err => {
    console.log('Error while deleting Recipe: ', err);
  });
};

/*** FUNCTIONS */
const fetchRecipeNames = async (forceFetch = false) => {
  //Fetches the recipeNames from db only when recipeNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_recipeNames || _recipeNames.length === 0) {
    await RecipeHandler.fetchAllNames().then((recipeNames) => { _recipeNames = recipeNames});
  }
};

const refactorValuesForDb = (recipe: RecipeHandler) => {
  recipe = refactorMealTypeValues(recipe);
  recipe.ingredients = refactorIngredients(recipe.ingredients);
  recipe.safeForConditions = refactorChronicConditions(recipe.safeForConditions);
  recipe.notRecommendedForConditions = refactorChronicConditions(recipe.notRecommendedForConditions);
  recipe.compatibleWithDiets = refactorCompatibleWithDiets(recipe.compatibleWithDiets);
  recipe.recommendedForCyclePhases = refactorCyclePhases(recipe.recommendedForCyclePhases);
  return recipe;
};

const refactorIngredients = (ingredients)  => {
  if (!ingredients){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(ingredients) === 'string') {
    ingredients = [ingredients]; 
  }
  //Fetches all the foods to pair with their names
  if (!_foodNames || _foodNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _foodNames = FoodHandler.foodStaticValues.foods;
  }

  let refactoredFoods: FoodIdAndName[] = [];
  ingredients.forEach(foodId => 
    {
      if (!foodId) return; //skips empty selections

      const foodObject: FoodIdAndName = {
        foodId: new ObjectId(foodId),
        foodName: _foodNames.find(c => c._id === foodId)?.name || 'Nombre no disponible'
      };

      refactoredFoods.push(foodObject);
    });
  
  return refactoredFoods;
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

const refactorChronicConditions = (selectedConditions) => {
  if (!selectedConditions){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedConditions) === 'string') {
    selectedConditions = [selectedConditions]; 
  }
  //Fetches all the chronic conditions to pair with their names
  if (!_conditionNames || _conditionNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _conditionNames = ChronicConditionHandler.chronicConditionsStaticValues.chronicConditions;
  }

  let refactoredConditions: ConditionIdAndName[] = [];
  selectedConditions.forEach(conditionId => 
    {
      if (!conditionId) return; //skips empty selections

      const conditionObject: ConditionIdAndName = {
        conditionId: new ObjectId(conditionId),
        conditionName: _conditionNames.find(c => c._id === conditionId)?.name || 'Nombre no disponible'
      };

      refactoredConditions.push(conditionObject);
    });
  
  return refactoredConditions;
};

const refactorCompatibleWithDiets = (selectedDietsCompatible) => {
  if (!selectedDietsCompatible) {return null;}

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedDietsCompatible) === 'string') {
    selectedDietsCompatible = [selectedDietsCompatible]; 
  }
  //Fetches all the diets to pair with their names
  if (!_dietNames || _dietNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _dietNames = DietHandler.compatibleWithDietsStaticValues.diets;
  }

  let refactoredDiets: DietIdAndName[] = [];
  selectedDietsCompatible.forEach(dietId => 
    {
      if (!dietId) return; //skips empty selections

      const dietObject: DietIdAndName = {
        dietId: new ObjectId(dietId),
        dietName: _dietNames.find(c => c._id === dietId)?.name || 'Nombre no disponible'
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