const Muscle = require('../../models/activities/muscle');

exports.getMuscle = (request, response) => {
  response.render('./activities/view-muscle', {
    caller: 'view-muscle',
    pageTitle: 'Información de músculo',
  });
};

exports.getAddMuscle = (request, response) => {
  response.render('./activities/add-muscle', {
    caller: 'add-muscle',
    pageTitle: 'Añadi;r músculo',
  });
};

exports.addMuscle = (request) => {
  const muscle = new Muscle(request.body);
  muscle.save();
  console.log(Muscle.fetchAll());
  // response.redirect('/activities/muscle');
};
