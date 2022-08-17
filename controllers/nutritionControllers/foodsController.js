const ObjectId = require('mongodb').ObjectId;
const MenstrualCyclePhase = require('../../models/general/menstrualCyclePhase');
const ChronicCondition = require('../../models/nutritionModels/chronicConditionModel');
const Diet = require('../../models/nutritionModels/dietModel');
const {FoodHandler, Food} = require('../../models/nutritionModels/foodModel');
let _foodNames = [
  {_id: "3erq32efq23ef23f", name: "Test Food"}
];
let _conditionNames = [];
let _dietNames = [];

/** RENDERS */
exports.redirectToViewSelectFood = (req, res) => {
  res.redirect(`/nutrition/food`);
}

exports.redirectToViewSelectedFood = (req, res) => {
  res.redirect(`/nutrition/food/${req.body.selectedFood}`);
}

exports.getViewToSelectFood = (req, res) => {

    // FoodHandler.fetchAllNames()
    // .then((foodNames) => {
    //   _foodNames = foodNames;
    //   res.render('./nutrition/view-food', {
    //     caller: 'view-food',
    //     pageTitle: 'Selecciona la comida',
    //     foodSelectOptions: FoodHandler.foodSelectOptions,
    //     foodNames: foodNames,
    //     selectedFoodInfo: null
    //   });
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    res.render('./nutrition/view-food', {
      caller: 'view-food',
      pageTitle: 'Selecciona la comida',
      foodSelectOptions: FoodHandler.foodSelectOptions,
      foodNames: _foodNames,
      selectedFoodInfo: null
    });
};

exports.getViewOfSelectedFood = async (req, res) => {
  const selectedFoodId = req.params.foodId;

  //Fetches the foodNames from db if names don't exist or if the current foodId doesn't exist in array
  //Note: This logic is needed to fetch the new food info once a new food has been added to the db
  const index = _foodNames?.findIndex(f => f._id.toString() == selectedFoodId);
  (index > -1) ? await fetchFoodNames(false) : await fetchFoodNames(true);

  FoodHandler.fetchById(selectedFoodId)
  .then((selectedFoodInfo) => {
    res.render('./nutrition/view-food', {
      caller: 'view-food',
      pageTitle: 'Información de comida',
      foodNames: _foodNames,
      foodSelectOptions: FoodHandler.foodSelectOptions,
      selectedFoodInfo: selectedFoodInfo,
      chronicConditions: ChronicCondition.chronicConditionsStaticValues.chronicConditions,
      diets: Diet.compatibleWithDietsStaticValues.diets,
      menstrualCyclePhases: MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

exports.getViewToAddFood = async (req, res) => {
  //Fetches the foodNames from db if for some reason the data was lost from previous method
  await fetchFoodNames();

  res.render('./nutrition/add-food', {
    caller: 'add-food',
    pageTitle: 'Añadir comida',
    foodNames: _foodNames,
    foodSelectOptions: FoodHandler.foodSelectOptions,
    selectedFoodInfo: null,
    chronicConditions: ChronicCondition.chronicConditionsStaticValues.chronicConditions,
    diets: Diet.compatibleWithDietsStaticValues.diets,
    menstrualCyclePhases: MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases
  });
};

exports.addFood = (req, res) => {
  // let foodHandler = new FoodHandler(req.body);
  // foodHandler = refactorValuesForDb(food);

  const food = new Food({
    name: 'Test',
    description: 'Test',
    classification: 'Test'
  });

  food.save()
  .then((result) => {
    console.log('Result =>>>', result);
    res.redirect(`/nutrition/food/${result._id.toString()}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

exports.updateFood = (req, res) => {
  const foodId = req.params.foodId;

  let food = new FoodHandler(req.body);
  food.id = foodId;
  food = refactorValuesForDb(food);
  
  food.update()
  .then((result) => {
    res.redirect(`/nutrition/food/${foodId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
exports.apiDeleteFood = (req, res) => {
  const foodId = req.params.foodId;

  FoodHandler.deleteById(foodId)
  .then( deleteResponse => {
    console.log('deleteResponse', deleteResponse);
    //removes the food from foods dropdown
    const index = _foodNames?.findIndex(f => f._id.toString() == foodId);
    if (index > -1){
      _foodNames.splice(index, 1);
    }
    res.redirect(`/nutrition/food/`);
  })
  .catch(err => {
    console.log('Error while deleting Food: ', err);
  });
};

/*** FUNCTIONS */
let fetchFoodNames = async (forceFetch = false) => {
  //Fetches the foodNames from db only when foodNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_foodNames || _foodNames.length === 0) {
    await FoodHandler.fetchAllNames().then((foodNames) => { _foodNames = foodNames});
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
  return selectedPhases.filter(p => p);
};