const chronicConditions = [];

exports.getChronicConditions = (request, response, next) => {
  response.render('./nutrition/view-chronicCondition', {
    caller: 'view-chronicCondition',
    chronicConditions: chronicConditions,
    pageTitle: 'Información de condición crónica',
  });
};

exports.getAddChronicConditions = (request, response, next) => {
  response.render('./nutrition/add-chronicCondition', {
    caller: 'add-chronicCondition',
    chronicConditions: chronicConditions,
    pageTitle: 'Añadir condición crónica',
  });
};
