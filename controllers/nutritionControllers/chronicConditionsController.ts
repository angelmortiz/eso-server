import ChronicCondition from '../../models/nutritionModels/chronicConditionModel';

export const getChronicConditions = (request, response, next) => {
  response.render('./nutrition/view-chronicCondition', {
    caller: 'view-chronicCondition',
    pageTitle: 'Información de condición crónica',
  });
};

export const getAddChronicConditions = (request, response, next) => {
  response.render('./nutrition/add-chronicCondition', {
    caller: 'add-chronicCondition',
    pageTitle: 'Añadir condición crónica',
  });
};

export const addChronicCondition = (request) => {
  const chronicCondition = new ChronicCondition(request.body);
  chronicCondition.save();
  console.log(ChronicCondition.fetchAll());
  // response.redirect('/nutrition/chronicCondition')
};

export const apiGetChronicConditions = (request, response) => {
  response.json(ChronicCondition.chronicConditionsStaticValues.chronicConditions);
};