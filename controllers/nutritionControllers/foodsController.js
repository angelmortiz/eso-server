const { ObjectID } = require('bson');
const MenstrualCyclePhase = require('../../models/general/menstrualCyclePhase');
const ChronicCondition = require('../../models/nutritionModels/chronicConditionModel');
const Diet = require('../../models/nutritionModels/dietModel');
const Food = require('../../models/nutritionModels/foodModel');
let _foodNames = [];

exports.selectedFood = null;

/** RENDERS */
//FIXME: Maybe create one method mergin getFood and getFoodInfo
exports.getFood = (request, response) => {
    Food.fetchAllNames()
    .then((foodNames) => {
      _foodNames = foodNames;
      //render page using food names
      response.render('./nutrition/view-food', {
        caller: 'view-food',
        pageTitle: 'Información de comida',
        foodValues: Food.foodStaticValues,
        foodNames: foodNames,
        foodInfo: null,
        selectedFoodId: null
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getFoodInfo = (request, response) => {
  const selectedFoodId = request.params.foodId;

  Food.fetchById(selectedFoodId)
  .then((foodInfo) => {
    //save food value in share var
    selectedFood = foodInfo;

    //render page using food names
    response.render('./nutrition/view-food', {
      caller: 'view-food',
      pageTitle: 'Información de comida',
      foodValues: Food.foodStaticValues,
      foodInfo: foodInfo,
      foodNames: _foodNames,
      selectedFoodId: selectedFoodId,
      chronicConditions: ChronicCondition.chronicConditionsStaticValues.chronicConditions,
      diets: Diet.dietCompatibleStaticValues.diets,
      menstrualCyclePhases: MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases
    });
  })
  .catch((error) => {
    console.log(error);
  });
};

exports.redirectToFoodInfo = (request, response) => {
  response.redirect(`/nutrition/food/${request.body.selectedFood}`)
}

exports.getAddFood = (request, response) => {
  response.render('./nutrition/add-food', {
    caller: 'add-food',
    pageTitle: 'Añadir comida',
  });
};

exports.addFood = (request) => {
  const food = new Food(request.body);
  food
    .save()
    .then((result) => {
      console.log('New food was saved to db.');
    })
    .catch((error) => {
      console.log(error);
    });

  // response.redirect('/nutrition/food')
};

exports.updateFood = (request) => {
  let food = new Food(request.body);
  food.id = request.params.foodId;

  food = refactorValuesForDb(food);

  console.log('food', food);
  
  food.update();
  // response.redirect('/nutrition/food')
};

refactorValuesForDb = (food) => {
  food.safeForConditions = refactorSafeForConditions(food.safeForConditions);
  food = refactorMealTypeValues(food);
  return food;
};

refactorSafeForConditions = (conditions) => {
  if (!conditions) return null;
  
  let newConditions = [];
  conditions.forEach(condition => newConditions.push(new ObjectID(condition)) );
  
  return newConditions;
};

refactorMealTypeValues = (food) => {
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

/** APIS */
exports.apiDeleteFood = (request, response) => {
  Food.deleteById(request.params.foodId)
  .then( deleteResponse => {
    console.log('deleteResponse', deleteResponse);
    response.json({"status": "Deleted"});
  })
  .catch(err => {
    console.log('Error while deleting Food: ', err);
    response.json({"status": "Error", "description": err});
  });
};