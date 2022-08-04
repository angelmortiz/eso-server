const { ObjectId } = require('mongodb');
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
  // const food = new Food(request.body);
  // food
  //   .save()
  //   .then((result) => {
  //     console.log('New food was saved on db.');
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // Food.fetchAllNames()
  //   .then((products) => {
  //     console.log('All foods:', products);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

    Food.fetchById(new ObjectId('62ec3217615ca29db0946483'))
    .then((product) => {
      console.log('Food:', product);
    })
    .catch((error) => {
      console.log(error);
    });

  // response.redirect('/nutrition/food')
};
