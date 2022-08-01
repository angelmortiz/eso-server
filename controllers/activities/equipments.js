const equipments = [];

exports.getEquipment = (request, response, next) => {
    response.render('./activities/view-equipment', {
        caller: 'view-equipment',
        equipments: equipments,
        pageTitle: 'Información de equipo'
      });
};

exports.getAddEquipment = (request, response, next) => {
    response.render('./activities/add-equipment', {
        caller: 'add-equipment',
        equipments: equipments,
        pageTitle: 'Añadir equipo'
      });
};