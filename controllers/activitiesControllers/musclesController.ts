import Muscle from '../../models/activitiesModels/muscleModel';

export const getMuscle = (request, response) => {
  response.render('./activities/view-muscle', {
    caller: 'view-muscle',
    pageTitle: 'Información de músculo',
  });
};

export const getAddMuscle = (request, response) => {
  response.render('./activities/add-muscle', {
    caller: 'add-muscle',
    pageTitle: 'Añadi;r músculo',
  });
};

export const addMuscle = (request) => {
  const muscle = new Muscle(request.body);
  muscle.save();
  console.log(Muscle.fetchAll());
  // response.redirect('/activities/muscle');
};
