const ChronicCondition = require('../../models/nutritionModels/chronicConditionModel');

exports.getChronicConditions = (request, response, next) => {
  response.render('./nutrition/view-chronicCondition', {
    caller: 'view-chronicCondition',
    pageTitle: 'Información de condición crónica',
  });
};

exports.getAddChronicConditions = (request, response, next) => {
  response.render('./nutrition/add-chronicCondition', {
    caller: 'add-chronicCondition',
    pageTitle: 'Añadir condición crónica',
  });
};

exports.addChronicCondition = (request) => {
  const chronicCondition = new ChronicCondition(request.body);
  chronicCondition.save();
  console.log(ChronicCondition.fetchAll());
  // response.redirect('/nutrition/chronicCondition')
};

exports.apiGetChronicConditions = (request, response) => {
  response.json(ChronicCondition.chronicConditionsStaticValues.chronicConditions);
};