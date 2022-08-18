import Diet from '../../models/nutritionModels/dietModel';

export const getDiet = (request, response, next) => {
  response.render('./nutrition/view-diet', {
    caller: 'view-diet',
    pageTitle: 'Información de dieta',
  });
};

export const getAddDiet = (request, response, next) => {
  response.render('./nutrition/add-diet', {
    caller: 'add-diet',
    pageTitle: 'Añadir dieta',
  });
};

export const addDiet = (request) => {
  const diet = new Diet(request.body);
  diet.save();
  console.log(Diet.fetchAll());
  // response.redirect('/nutrition/diet')
};

export const apiGetDiets = (request, response) => {
  response.json(Diet.compatibleWithDietsStaticValues.diets);
};