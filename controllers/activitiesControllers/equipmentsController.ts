import Equipment from '../../models/activitiesModels/equipmentModel';

export const getEquipment = (req, res) => {
    res.render('./activities/view-equipment', {
        caller: 'view-equipment',
        pageTitle: 'Información de equipo'
      });
};

export const getAddEquipment = (req, res) => {
    res.render('./activities/add-equipment', {
        caller: 'add-equipment',
        pageTitle: 'Añadir equipo'
      });
};

export const addEquipment = (req) => {
  const equipment = new Equipment(req.body);
  equipment.save();
  console.log(Equipment.fetchAll());
  // res.redirect('/activities/equipment');
};