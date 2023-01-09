import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { ExerciseIdAndName } from '../../util/types/types';
import  *  as ResponseCodes from '../general/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';

/** APIS */
export const apiGetEquipments = async (req: Request, res: Response) => {
  res.json(await EquipmentHandler.getAllNames());
};

export const apiGetEquipmentNames = async (req: Request, res: Response) => {
  res.json(await EquipmentHandler.fetchAllNames());
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