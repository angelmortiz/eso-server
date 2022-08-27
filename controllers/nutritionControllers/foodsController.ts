import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import { ConditionIdAndName, DietIdAndName } from '../../util/types/types';
import { IFood } from '../../util/interfaces/nutritionInterfaces';
import FoodHandler from '../../models/nutritionModels/foodModel';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

/** RENDERS */
export const redirectToViewAddFood = (req: Request, res: Response) => {
  res.redirect(`/nutrition/add-food`);
}

export const redirectToViewSelectedFood = (req: Request, res: Response) => {
  res.redirect(`/nutrition/food/${req.body.selectedFood}`);
}

export const getViewToSelectedFood = async (req: Request, res: Response) => {
  const selectedFoodId: string = req.params.foodId;
  let selectedFoodInfo: IFood = {} as IFood;
  
  //if selectedFoodId is new, fetches all names. Otherwise, returns local list.
  const foodNames = await FoodHandler.getAllNames(selectedFoodId);

  //gets the information of the selected food
  await FoodHandler.fetchById(selectedFoodId)
  .then(selectedFood => selectedFoodInfo = selectedFood)
  .catch((err) => { console.log(err); return; });

  res.render('./nutrition/view-food', {
    caller: 'view-food',
    pageTitle: 'Información de comida',
    foodNames: foodNames,
    foodSelectOptions: FoodHandler.foodSelectOptions,
    selectedFoodInfo: selectedFoodInfo,
    chronicConditions: await ChronicConditionHandler.getAllNames(),
    diets: await DietHandler.getAllNames(),
    menstrualCyclePhases: MenstrualCyclePhaseHandler.getAllNames()
  });
};

export const getViewToAddFood = async (req: Request, res: Response) => {
  res.render('./nutrition/add-food', {
    caller: 'add-food',
    pageTitle: 'Añadir comida',
    foodNames: await FoodHandler.getAllNames(),
    foodSelectOptions: FoodHandler.foodSelectOptions,
    selectedFoodInfo: null,
    chronicConditions: await ChronicConditionHandler.getAllNames(),
    diets: await DietHandler.getAllNames(),
    menstrualCyclePhases: MenstrualCyclePhaseHandler.getAllNames()
  });
};

/** ACTIONS */
export const addFood = async (req: Request, res: Response) => {
  let foodHandler = new FoodHandler(req.body);
  foodHandler = await refactorValuesForDb(foodHandler);
  foodHandler.save().then( id => res.redirect(`/nutrition/food/${id}`) );
};

export const updateFood = async (req: Request, res: Response) => {
  const foodId: string = req.params.foodId;
  let food = new FoodHandler(req.body);
  food.id = foodId;
  food = await refactorValuesForDb(food);
  
  food.update()
  .then(() => {
    res.redirect(`/nutrition/food/${foodId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

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