const Food = require('../../models/nutritionModels/foodModel');
let _foodNames = [];

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
    //render page using food names
    response.render('./nutrition/view-food', {
      caller: 'view-food',
      pageTitle: 'Información de comida',
      foodValues: Food.foodStaticValues,
      foodInfo: foodInfo,
      foodNames: _foodNames,
      selectedFoodId: selectedFoodId
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
