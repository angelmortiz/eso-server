const muscles = [];

exports.getMuscle = (request, response, next) => {
    response.render('./activities/view-muscle', {
        caller: 'view-muscle',
        muscles: muscles,
        pageTitle: 'Información de músculo'
      });
};

exports.getAddMuscle = (request, response, next) => {
    response.render('./activities/add-muscle', {
        caller: 'add-muscle',
        muscles: muscles,
        pageTitle: 'Añadi;r músculo'
      });
}