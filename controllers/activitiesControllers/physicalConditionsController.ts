import PhysicalCondition from '../../models/activitiesModels/physicalConditionModel';

export const getPhysicalCondition = (request, response, next) => {
  response.render('./activities/view-physicalCondition', {
    caller: 'view-physicalCondition',
    pageTitle: 'Información de condición física',
  });
};

export const getAddPhysicalCondition = (request, response, next) => {
  response.render('./activities/add-physicalCondition', {
    caller: 'add-physicalCondition',
    pageTitle: 'Añadir condición física',
  });
};

export const addPhysicalCondition = (request) => {
  const physicalCondition = new PhysicalCondition(request.body);
  physicalCondition.save();
  console.log(PhysicalCondition.fetchAll());
  // response.redirect('/activities/physicalCondition');
};