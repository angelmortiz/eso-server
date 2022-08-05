const Diet = require('../../models/nutrition/diet');

exports.getDiet = (request, response, next) => {
  response.render('./nutrition/view-diet', {
    caller: 'view-diet',
    pageTitle: 'Información de dieta',
  });
};

exports.getAddDiet = (request, response, next) => {
  response.render('./nutrition/add-diet', {
    caller: 'add-diet',
    pageTitle: 'Añadir dieta',
  });
};

exports.addDiet = (request) => {
  const diet = new Diet(request.body);
  diet.save();
  console.log(Diet.fetchAll());
  // response.redirect('/nutrition/diet')
};