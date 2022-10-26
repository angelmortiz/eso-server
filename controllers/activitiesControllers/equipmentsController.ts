import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import { ExerciseIdAndName } from '../../util/types/types';
import { IEquipment } from '../../util/interfaces/activitiesInterfaces';
import  *  as ResponseCodes from '../general/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';

/** RENDERS */
export const redirectToViewAddEquipment = (req: Request, res: Response) => {
  res.redirect(`/activities/add-equipment`);
}

export const redirectToViewSelectedEquipment = (req: Request, res: Response) => {
  res.redirect(`/activities/equipment/${req.body.selectedEquipment}`);
}

export const getViewToSelectedEquipment = async (req: Request, res: Response) => {
  const selectedEquipmentId: string = req.params.equipmentId;
  let selectedEquipmentInfo: IEquipment = {} as IEquipment;
  
  //if selectedEquipmentId is new, fetches all names. Otherwise, returns local list.
  const equipmentNames = await EquipmentHandler.getAllNames(selectedEquipmentId);

  //gets the information of the selected equipment
  await EquipmentHandler.fetchById(selectedEquipmentId)
  .then(selectedEquipment => selectedEquipmentInfo  = selectedEquipment)
  .catch((err) => { console.log(err); return; });

  res.render('./activities/view-equipment', {
    caller: 'view-equipment',
    pageTitle: 'Información de equipo',
    equipmentNames: equipmentNames,
    selectedEquipmentInfo: selectedEquipmentInfo,
    exercises: await ExerciseHandler.getAllNames()
  });
};

export const getViewToAddEquipment = async (req: Request, res: Response) => {
    res.render('./activities/add-equipment', {
    caller: 'add-equipment',
    pageTitle: 'Añadir equipo',
    equipmentNames: await EquipmentHandler.getAllNames(),
    exercises: await ExerciseHandler.getAllNames(),
    selectedEquipmentInfo: null
  });
};

/** ACTIONS */
export const addEquipment = async (req: Request, res: Response) => {
  let equipmentHandler = new EquipmentHandler(req.body);
  equipmentHandler = await refactorValuesForDb(equipmentHandler);
  equipmentHandler.save().then( id => res.redirect(`/activities/equipment/${id}`) );
};

export const updateEquipment = async (req: Request, res: Response) => {
  const equipmentId: string = req.params.equipmentId;
  let equipment = new EquipmentHandler(req.body);
  equipment.id = equipmentId;
  equipment = await refactorValuesForDb(equipment);

  equipment.update()
  .then(() => {
    res.redirect(`/activities/equipment/${equipmentId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiGetEquipments = async (req: Request, res: Response) => {
  res.json(await EquipmentHandler.getAllNames());
};

export const apiAddEquipment = (req: Request, res: Response) => {
  let equipmentHandler = new EquipmentHandler(req.body);

  //TODO: Implement an error catcher
  equipmentHandler.save().then( _ => res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY()) );
};

export const apiDeleteEquipment = (req: Request, res: Response) => {
  const equipmentId: string = req.params.equipmentId;

  EquipmentHandler.deleteById(equipmentId)
  .then( deleteResponse => {
    //removes the equipment from equipments dropdown
    EquipmentHandler.removeNameById(equipmentId);
    console.log(`'${deleteResponse.name}' physical equipment deleted successfully.`);
    res.redirect(`/activities/equipment/`);
  })
  .catch(err => {
    console.log('Error while deleting Equipment: ', err);
  });
};

/*** FUNCTIONS */
const refactorValuesForDb = async (equipment: EquipmentHandler) => {
  equipment.exercises = await reformatExerciseValues(equipment.exercises);
  return equipment;
};

const reformatExerciseValues = async (selectedExercises) => {
  if (!selectedExercises){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedExercises) === 'string') {
    selectedExercises = [selectedExercises]; 
  }
  //Fetches all the chronic exercises to pair with their names
  const _exerciseNames = await ExerciseHandler.getAllNames();

  let refactoredExercises: ExerciseIdAndName[] = [];
  selectedExercises.forEach(exerciseId => 
    {
      if (!exerciseId) return; //skips empty selections

      const exerciseObject: ExerciseIdAndName = {
        exerciseId: new ObjectId(exerciseId),
        exerciseName: _exerciseNames.find(c => c._id === exerciseId)?.name || 'Name not available'
      };

      refactoredExercises.push(exerciseObject);
    });
  
  return refactoredExercises;
};