import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import { ConditionIdAndName, DietIdAndName } from '../../util/types/types';
import FoodHandler from '../../models/nutritionModels/foodModel';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';

/** APIS */
export const apiGetFoods = async (req: Request, res: Response) => {
  res.json(await FoodHandler.getAllNames());
};

export const apiDeleteFood = (req: Request, res: Response) => {
  const foodId: string = req.params.foodId;

  FoodHandler.deleteById(foodId)
  .then( deleteResponse => {
    //removes the food from foods dropdown
    FoodHandler.removeNameById(foodId);
    console.log(`'${deleteResponse.name}' food deleted successfully.`);
    res.redirect(`/nutrition/food/`);
  })
  .catch(err => {
    console.log('Error while deleting Food: ', err);
  });
};

/*** FUNCTIONS */

const refactorValuesForDb = async (food: FoodHandler) => {
  food = refactorMealTypeValues(food);
  food.safeForConditions = await refactorChronicConditions(food.safeForConditions);
  food.notRecommendedForConditions = await refactorChronicConditions(food.notRecommendedForConditions);
  food.compatibleWithDiets = await refactorCompatibleWithDiets(food.compatibleWithDiets);
  food.recommendedForCyclePhases = refactorCyclePhases(food.recommendedForCyclePhases);
  return food;
};

const refactorMealTypeValues = (food) => {
  food.mealType = [];

  if (food.breakfast) {
    food.mealType.push('Desayuno');
    delete food.breakfast;
  }
  if (food.lunch) {
    food.mealType.push('Almuerzo');
    delete food.lunch;
  }
  if (food.dinner) {
    food.mealType.push('Cena');
    delete food.dinner;
  }

  return food;
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