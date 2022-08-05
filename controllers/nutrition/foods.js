const Food = require('../../models/nutrition/food');

exports.getFood = (request, response) => {
  response.render('./nutrition/view-food', {
    caller: 'view-food',
    pageTitle: 'Información de comida',
  });
};

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
