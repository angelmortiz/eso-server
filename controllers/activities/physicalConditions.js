const physicalCondition = [];

exports.getPhysicalCondition = (request, response, next) => {
    response.render('./activities/view-physicalCondition', {
        caller: 'view-physicalCondition',
        physicalCondition: physicalCondition,
        pageTitle: 'Información de condición física'
      });
};

exports.getAddPhysicalCondition = (request, response, next) => {
    response.render('./activities/add-physicalCondition', {
        caller: 'add-physicalCondition',
        physicalCondition: physicalCondition,
        pageTitle: 'Añadir condición física'
      });
};