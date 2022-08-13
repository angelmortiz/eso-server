const ObjectId = require('mongodb').ObjectId;
const MenstrualCyclePhase = require('../../models/general/menstrualCyclePhase');
const ChronicCondition = require('../../models/nutritionModels/chronicConditionModel');
const Diet = require('../../models/nutritionModels/dietModel');
const Food = require('../../models/nutritionModels/foodModel');
let _foodNames = [];
let _conditionNames = [];
let _dietNames = [];

/** RENDERS */
exports.redirectToViewSelectFood = (request, response) => {
  response.redirect(`/nutrition/food`);
}

exports.redirectToViewSelectedFood = (request, response) => {
  response.redirect(`/nutrition/food/${request.body.selectedFood}`);
}

exports.getViewToSelectFood = (request, response) => {
    Food.fetchAllNames()
    .then((foodNames) => {
      _foodNames = foodNames;
      response.render('./nutrition/view-food', {
        caller: 'view-food',
        pageTitle: 'Información de comida',
        foodSelectOptions: Food.foodSelectOptions,
        foodNames: foodNames,
        selectedFoodInfo: null
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getViewOfSelectedFood = async (request, response) => {
  const selectedFoodId = request.params.foodId;

  //Fetches the foodNames from db if names don't exist or if the current foodId doesn't exist in array
  const index = _foodNames?.findIndex(f => f._id.toString() == selectedFoodId);
  (index > -1) ? await fetchFoodNames(false) : await fetchFoodNames(true);

  Food.fetchById(selectedFoodId)
  .then((selectedFoodInfo) => {
    response.render('./nutrition/view-food', {
      caller: 'view-food',
      pageTitle: 'Información de comida',
      foodNames: _foodNames,
      foodSelectOptions: Food.foodSelectOptions,
      selectedFoodInfo: selectedFoodInfo,
      chronicConditions: ChronicCondition.chronicConditionsStaticValues.chronicConditions,
      diets: Diet.compatibleWithDietsStaticValues.diets,
      menstrualCyclePhases: MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases
    });
  })
  .catch((error) => {
    console.log(error);
  });
};

exports.getViewToAddFood = async (request, response) => {
  //Fetches the foodNames from db if for some reason the data was lost from previous method
  await fetchFoodNames();

  response.render('./nutrition/add-food', {
    caller: 'add-food',
    pageTitle: 'Añadir comida',
    foodNames: _foodNames,
    foodSelectOptions: Food.foodSelectOptions,
    selectedFoodInfo: null,
    chronicConditions: ChronicCondition.chronicConditionsStaticValues.chronicConditions,
    diets: Diet.compatibleWithDietsStaticValues.diets,
    menstrualCyclePhases: MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases
  });
};

exports.addFood = (request, response) => {
  let food = new Food(request.body);
  food = refactorValuesForDb(food);
  
  food.save()
  .then((result) => {
    response.redirect(`/nutrition/food/${result.insertedId.toString()}`);
  })
  .catch((error) => {
    console.log('Error while inserting document to db', error);
  });
};

exports.updateFood = (request, response) => {
  const foodId = request.params.foodId;

  let food = new Food(request.body);
  food.id = foodId;
  food = refactorValuesForDb(food);
  
  food.update()
  .then((result) => {
    response.redirect(`/nutrition/food/${foodId}`);
  })
  .catch((error) => {
    console.log('Error while inserting document to db', error);
  });
};

/** APIS */
exports.apiDeleteFood = (request, response) => {
  const foodId = request.params.foodId;

  Food.deleteById(foodId)
  .then( deleteResponse => {
    console.log('deleteResponse', deleteResponse);
    //removes the food from foods dropdown
    const index = _foodNames?.findIndex(f => f._id.toString() == foodId);
    if (index > -1){
      _foodNames.splice(index, 1);
    }
    response.redirect(`/nutrition/food/`);
  })
  .catch(err => {
    console.log('Error while deleting Food: ', err);
  });
};

/*** FUNCTIONS */
let fetchFoodNames = async (forceFetch = false) => {
  //Fetches the foodNames from db if for some reason the data was lost from previous method
  if (forceFetch || !_foodNames || _foodNames.length === 0) {
    await Food.fetchAllNames().then((foodNames) => { _foodNames = foodNames});
  }
};

let refactorValuesForDb = (food) => {
  food = refactorMealTypeValues(food);
  food.safeForConditions = refactorChronicConditions(food.safeForConditions);
  food.notRecommendedForConditions = refactorChronicConditions(food.notRecommendedForConditions);
  food.compatibleWithDiets = refactorCompatibleWithDiets(food.compatibleWithDiets);
  food.recommendedForCyclePhases = refactorCyclePhases(food.recommendedForCyclePhases);
  return food;
};

let refactorMealTypeValues = (food) => {
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

let refactorChronicConditions = (selectedConditions) => {
  if (!selectedConditions){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedConditions) === 'string') {
    selectedConditions = [selectedConditions]; 
  }
  //Fetches all the chronic conditions to pair with their names
  if (!_conditionNames || _conditionNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _conditionNames = ChronicCondition.chronicConditionsStaticValues.chronicConditions;
  }

  let refactoredConditions = [];
  selectedConditions.forEach(conditionId => 
    {
      if (!conditionId) return; //skips empty selections

      const conditionObject = {
        conditionId: new ObjectId(conditionId),
        conditionName: _conditionNames.find(c => c._id === conditionId)?.name
      };

      refactoredConditions.push(conditionObject);
    });
  
  return refactoredConditions;
};

let refactorCompatibleWithDiets = (selectedDietsCompatible) => {
  if (!selectedDietsCompatible) {return null;}

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedDietsCompatible) === 'string') {
    selectedDietsCompatible = [selectedDietsCompatible]; 
  }
  //Fetches all the diets to pair with their names
  if (!_dietNames || _dietNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _dietNames = Diet.compatibleWithDietsStaticValues.diets;
  }

  let refactoredDiets = [];
  selectedDietsCompatible.forEach(dietId => 
    {
      if (!dietId) return; //skips empty selections

      const dietObject = {
        dietId: new ObjectId(dietId),
        dietName: _dietNames.find(c => c._id === dietId)?.name
      };

      refactoredDiets.push(dietObject);
    });
  
  return refactoredDiets;

};

let refactorCyclePhases = (selectedPhases) => {
  if (!selectedPhases) { return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedPhases) === 'string')
  {
    selectedPhases = [selectedPhases];
  }
  
  //removes all empty options if necessary.
  const filtered = selectedPhases.filter(p => p);
  return filtered;
};