import {ObjectId} from 'bson';
import {Request, Response} from 'express';
import {ExerciseIdAndName} from '../../util/types/types';
import  *  as ResponseCodes from '../general/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import MuscleHandler from '../../models/activitiesModels/muscleModel';

/** APIS */
export const apiGetMuscles = async (req: Request, res: Response) => {
  res.json(await MuscleHandler.getAllNames());
};

export const apiGetMuscleNames = async (req: Request, res: Response) => {
  res.json(await MuscleHandler.fetchAllNames());
};

export const apiAddMuscle = (req: Request, res: Response) => {
  let muscleHandler = new MuscleHandler(req.body);

  console.log('muscleHandler: ', muscleHandler);
  //TODO: Implement an error catcher
  muscleHandler.save().then( response => {
    res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY());
    console.log('response: ', response);
  });
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