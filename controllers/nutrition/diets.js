const diets = [];

exports.getDiet = (request, response, next) => {
  response.render('./nutrition/view-diet', {
    caller: 'view-diet',
    diets: diets,
    pageTitle: 'Información de dieta',
  });
};

exports.getAddDiet = (request, response, next) => {
  response.render('./nutrition/add-diet', {
    caller: 'add-diet',
    diets: diets,
    pageTitle: 'Añadir dieta',
  });
};
