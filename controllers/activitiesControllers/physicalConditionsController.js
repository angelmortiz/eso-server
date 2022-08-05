const PhysicalCondition = require('../../models/activitiesModels/physicalConditionModel');

exports.getPhysicalCondition = (request, response, next) => {
  response.render('./activities/view-physicalCondition', {
    caller: 'view-physicalCondition',
    pageTitle: 'Información de condición física',
  });
};

exports.getAddPhysicalCondition = (request, response, next) => {
  response.render('./activities/add-physicalCondition', {
    caller: 'add-physicalCondition',
    pageTitle: 'Añadir condición física',
  });
};

exports.addPhysicalCondition = (request) => {
  const physicalCondition = new PhysicalCondition(request.body);
  physicalCondition.save();
  console.log(PhysicalCondition.fetchAll());
  // response.redirect('/activities/physicalCondition');
};