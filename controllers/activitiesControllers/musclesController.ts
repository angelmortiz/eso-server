import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import { ExerciseIdAndName, IdAndName } from '../../util/types/types';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import MuscleHandler from '../../models/activitiesModels/muscleModel';

let _muscleNames: IdAndName[] = [];
let _exerciseNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddMuscle = (req: Request, res: Response) => {
  res.redirect(`/activities/add-muscle`);
}

export const redirectToViewSelectedMuscle = (req: Request, res: Response) => {
  res.redirect(`/activities/muscle/${req.body.selectedMuscle}`);
}

export const getViewToSelectedMuscle = async (req: Request, res: Response) => {
  const selectedMuscleId: string = req.params.muscleId;

  //Fetches the muscleNames from db if names don't exist or if the current muscleId doesn't exist in array
  //Note: This logic is needed to fetch the new muscle info once a new muscle has been added to the db
  const index: number = _muscleNames?.findIndex(f => f._id.toString() == selectedMuscleId);
  (index > -1) ? await fetchMuscleNames(false) : await fetchMuscleNames(true);

  MuscleHandler.fetchById(selectedMuscleId)
  .then((selectedMuscleInfo) => {
    res.render('./activities/view-muscle', {
      caller: 'view-muscle',
      pageTitle: 'Información de músculo',
      muscleNames: _muscleNames,
      selectedMuscleInfo: selectedMuscleInfo,
      exercises: ExerciseHandler.exercisesStaticValues.exercises
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

export const getViewToAddMuscle = async (req: Request, res: Response) => {
  //Fetches the muscleNames from db if for some reason the data was lost from previous method
  await fetchMuscleNames();

  res.render('./activities/add-muscle', {
    caller: 'add-muscle',
    pageTitle: 'Añadir músculo',
    muscleNames: _muscleNames,
    exercises: ExerciseHandler.exercisesStaticValues.exercises,
    selectedMuscleInfo: null
  });
};

/** ACTIONS */
export const addMuscle = (req: Request, res: Response) => {
  let muscleHandler = new MuscleHandler(req.body);
  muscleHandler = refactorValuesForDb(muscleHandler);
  muscleHandler.save().then( id => res.redirect(`/activities/muscle/${id}`) );
};

export const updateMuscle = (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;
  let muscle = new MuscleHandler(req.body);
  muscle.id = muscleId;
  muscle = refactorValuesForDb(muscle);

  muscle.update()
  .then(() => {
    res.redirect(`/activities/muscle/${muscleId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiGetMuscles = (req: Request, res: Response) => {
  res.json(MuscleHandler.musclesStaticValues.muscles);
};

export const apiDeleteMuscle = (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;

  MuscleHandler.deleteById(muscleId)
  .then( deleteResponse => {
    //removes the muscle from muscles dropdown
    const index: number = _muscleNames?.findIndex(f => f._id.toString() == muscleId);
    if (index > -1){
      _muscleNames.splice(index, 1);
    }

    console.log(`'${deleteResponse.name}' physical muscle deleted successfully.`);

    res.redirect(`/activities/muscle/`);
  })
  .catch(err => {
    console.log('Error while deleting Muscle: ', err);
  });
};

/*** FUNCTIONS */
const fetchMuscleNames = async (forceFetch = false) => {
  //Fetches the muscleNames from db only when muscleNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_muscleNames || _muscleNames.length === 0) {
    // await MuscleHandler.fetchAllNames().then((muscleNames) => { _muscleNames = muscleNames});
    await MuscleHandler.fetchAllNames().then((muscleNames) => { _muscleNames = muscleNames });
  }
};

const refactorValuesForDb = (muscle: MuscleHandler): MuscleHandler => {
  muscle.exercises = reformatExerciseValues(muscle.exercises);
  return muscle;
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