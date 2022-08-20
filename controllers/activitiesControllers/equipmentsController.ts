import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import { ExerciseIdAndName, IdAndName } from '../../util/types/types';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';

let _equipmentNames: IdAndName[] = [];
let _exerciseNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddEquipment = (req: Request, res: Response) => {
  res.redirect(`/activities/add-equipment`);
}

export const redirectToViewSelectedEquipment = (req: Request, res: Response) => {
  res.redirect(`/activities/equipment/${req.body.selectedEquipment}`);
}

export const getViewToSelectedEquipment = async (req: Request, res: Response) => {
  const selectedEquipmentId: string = req.params.equipmentId;

  //Fetches the equipmentNames from db if names don't exist or if the current equipmentId doesn't exist in array
  //Note: This logic is needed to fetch the new equipment info once a new equipment has been added to the db
  const index: number = _equipmentNames?.findIndex(f => f._id.toString() == selectedEquipmentId);
  (index > -1) ? await fetchEquipmentNames(false) : await fetchEquipmentNames(true);

  EquipmentHandler.fetchById(selectedEquipmentId)
  .then((selectedEquipmentInfo) => {
    res.render('./activities/view-equipment', {
      caller: 'view-equipment',
      pageTitle: 'Información de equipo',
      equipmentNames: _equipmentNames,
      selectedEquipmentInfo: selectedEquipmentInfo,
      exercises: ExerciseHandler.exercisesStaticValues.exercises
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

export const getViewToAddEquipment = async (req: Request, res: Response) => {
  //Fetches the equipmentNames from db if for some reason the data was lost from previous method
  await fetchEquipmentNames();

  res.render('./activities/add-equipment', {
    caller: 'add-equipment',
    pageTitle: 'Añadir equipo',
    equipmentNames: _equipmentNames,
    exercises: ExerciseHandler.exercisesStaticValues.exercises,
    selectedEquipmentInfo: null
  });
};

/** ACTIONS */
export const addEquipment = (req: Request, res: Response) => {
  let equipmentHandler = new EquipmentHandler(req.body);
  equipmentHandler = refactorValuesForDb(equipmentHandler);
  equipmentHandler.save().then( id => res.redirect(`/activities/equipment/${id}`) );
};

export const updateEquipment = (req: Request, res: Response) => {
  const equipmentId: string = req.params.equipmentId;
  let equipment = new EquipmentHandler(req.body);
  equipment.id = equipmentId;
  equipment = refactorValuesForDb(equipment);

  equipment.update()
  .then(() => {
    res.redirect(`/activities/equipment/${equipmentId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiGetEquipments = (req: Request, res: Response) => {
  res.json(EquipmentHandler.equipmentsStaticValues.equipments);
};

export const apiDeleteEquipment = (req: Request, res: Response) => {
  const equipmentId: string = req.params.equipmentId;

  EquipmentHandler.deleteById(equipmentId)
  .then( deleteResponse => {
    //removes the equipment from equipments dropdown
    const index: number = _equipmentNames?.findIndex(f => f._id.toString() == equipmentId);
    if (index > -1){
      _equipmentNames.splice(index, 1);
    }

    console.log(`'${deleteResponse.name}' physical equipment deleted successfully.`);

    res.redirect(`/activities/equipment/`);
  })
  .catch(err => {
    console.log('Error while deleting Equipment: ', err);
  });
};

/*** FUNCTIONS */
const fetchEquipmentNames = async (forceFetch = false) => {
  //Fetches the equipmentNames from db only when equipmentNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_equipmentNames || _equipmentNames.length === 0) {
    // await EquipmentHandler.fetchAllNames().then((equipmentNames) => { _equipmentNames = equipmentNames});
    await EquipmentHandler.fetchAllNames().then((equipmentNames) => { _equipmentNames = equipmentNames });
  }
};

const refactorValuesForDb = (equipment: EquipmentHandler): EquipmentHandler => {
  equipment.exercises = reformatExerciseValues(equipment.exercises);
  return equipment;
};

const reformatExerciseValues = (selectedExercises) => {
  if (!selectedExercises){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedExercises) === 'string') {
    selectedExercises = [selectedExercises]; 
  }
  //Fetches all the chronic exercises to pair with their names
  if (!_exerciseNames || _exerciseNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _exerciseNames = ExerciseHandler.exercisesStaticValues.exercises;
  }

  let refactoredExercises: ExerciseIdAndName[] = [];
  selectedExercises.forEach(exerciseId => 
    {
      if (!exerciseId) return; //skips empty selections

      const exerciseObject: ExerciseIdAndName = {
        exerciseId: new ObjectId(exerciseId),
        exerciseName: _exerciseNames.find(c => c._id === exerciseId)?.name || 'Nombre no disponible'
      };

      refactoredExercises.push(exerciseObject);
    });
  
  return refactoredExercises;
};