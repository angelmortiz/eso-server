const foods = [];

exports.getFood = (request, response, next) => {
    response.render('./nutrition/view-food', {
      caller: 'view-food',
      foods: foods,
      pageTitle: 'Información de comida'
    });
};

exports.getAddFood = (request, response, next) => {
    response.render('./nutrition/add-food', {
      caller: 'add-food',
      foods: foods,
      pageTitle: 'Añadir comida'
    });
};

exports.addFood = (request, response, next) => {
    //add food info to db
  
    foods.push({ name: request.body.name });
    console.log(foods);
    // response.redirect('/nutrition/food')
  };

