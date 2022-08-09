const MenstrualCyclePhase = require('../../models/general/menstrualCyclePhase');
const ChronicCondition = require('../../models/nutritionModels/chronicConditionModel');
const Diet = require('../../models/nutritionModels/dietModel');
const Food = require('../../models/nutritionModels/foodModel');
let _foodNames = [];

exports.selectedFood = null;

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