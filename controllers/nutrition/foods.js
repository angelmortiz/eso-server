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
  food.save().then(result => {
    //FIXME: Add to log file
    console.log('New food was saved on db.');
  }).catch(error => {
    //FIXME: Add to log file
    console.log(error);
  });
  //console.log(Food.fetchAll());
  // response.redirect('/nutrition/food')
};
