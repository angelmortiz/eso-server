import {ObjectId} from 'bson';
import {Request, Response} from 'express';
import {ExerciseIdAndName} from '../../util/types/types';
import { IMuscle } from '../../util/interfaces/activitiesInterfaces';
import  *  as ResponseCodes from '../general/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import MuscleHandler from '../../models/activitiesModels/muscleModel';

/** RENDERS */
export const redirectToViewAddMuscle = (req: Request, res: Response) => {
  res.redirect(`/activities/add-muscle`);
}

export const redirectToViewSelectedMuscle = (req: Request, res: Response) => {
  res.redirect(`/activities/muscle/${req.body.selectedMuscle}`);
}

export const getViewToSelectedMuscle = async (req: Request, res: Response) => {
  const selectedMuscleId: string = req.params.muscleId;
  let selectedMuscleInfo: IMuscle = {} as IMuscle;

  //if selectedMuscleId is new, fetches all names. Otherwise, returns local list.
  const muscleNames = await MuscleHandler.getAllNames(selectedMuscleId);

  //gets the information of the selected muscle
  await MuscleHandler.fetchById(selectedMuscleId)
  .then(selectedMuscle => selectedMuscleInfo = selectedMuscle)
  .catch((err) => { console.log(err); return;  });

  res.render('./activities/view-muscle', {
    caller: 'view-muscle',
    pageTitle: 'Información de músculo',
    muscleNames: muscleNames,
    selectedMuscleInfo: selectedMuscleInfo,
    exercises: await ExerciseHandler.getAllNames()
  });
};

export const getViewToAddMuscle = async (req: Request, res: Response) => {
  res.render('./activities/add-muscle', {
    caller: 'add-muscle',
    pageTitle: 'Añadir músculo',
    muscleNames: await MuscleHandler.getAllNames(),
    exercises: await ExerciseHandler.getAllNames(),
    selectedMuscleInfo: null
  });
};

/** ACTIONS */
export const addMuscle = async (req: Request, res: Response) => {
  let muscleHandler = new MuscleHandler(req.body);
  muscleHandler = await refactorValuesForDb(muscleHandler);
  muscleHandler.save().then( id => res.redirect(`/activities/muscle/${id}`) );
};

export const updateMuscle = async (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;
  let muscle = new MuscleHandler(req.body);
  muscle.id = muscleId;
  muscle = await refactorValuesForDb(muscle);

  muscle.update()
  .then(() => {
    res.redirect(`/activities/muscle/${muscleId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiGetMuscles = async (req: Request, res: Response) => {
  res.json(await MuscleHandler.getAllNames());
};

export const apiAddMuscle = (req: Request, res: Response) => {
  let muscleHandler = new MuscleHandler(req.body);

  //TODO: Implement an error catcher
  muscleHandler.save().then( _ => res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY()) );
};

export const apiDeleteMuscle = (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;

  MuscleHandler.deleteById(muscleId)
  .then( deleteResponse => {
    //removes the muscle from muscles 
    MuscleHandler.removeNameById(muscleId);
    console.log(`'${deleteResponse.name}' physical muscle deleted successfully.`);
    res.redirect(`/activities/muscle/`);
  })
  .catch(err => {
    console.log('Error while deleting Muscle: ', err);
  });
};

/*** FUNCTIONS */
const refactorValuesForDb = async (muscle: MuscleHandler) => {
  muscle.exercises = await reformatExerciseValues(muscle.exercises);
  return muscle;
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
        exerciseName: _exerciseNames.find(
          e => e._id.toString() === exerciseId.toString())?.name || 'Nombre no disponible'
      };

      refactoredExercises.push(exerciseObject);
    });
  
  return refactoredExercises;
};