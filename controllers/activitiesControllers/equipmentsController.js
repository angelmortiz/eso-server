const Equipment = require('../../models/activitiesModels/equipmentModel');

exports.getEquipment = (request, response, next) => {
    response.render('./activities/view-equipment', {
        caller: 'view-equipment',
        pageTitle: 'Información de equipo'
      });
};

exports.getAddEquipment = (request, response, next) => {
    response.render('./activities/add-equipment', {
        caller: 'add-equipment',
        pageTitle: 'Añadir equipo'
      });
};

exports.addEquipment = (request) => {
  const equipment = new Equipment(request.body);
  equipment.save();
  console.log(Equipment.fetchAll());
  // response.redirect('/activities/equipment');
};