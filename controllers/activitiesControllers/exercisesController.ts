

import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { ConditionIdAndName, IdAndName } from '../../util/types/types';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

let _exerciseNames: IdAndName[] = [];
let _conditionNames: IdAndName[] = [];
let _musclesNames: IdAndName[] = [];
let _equipmentNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddExercise = (req: Request, res: Response) => {
  res.redirect(`/activities/add-exercise`);
}

export const redirectToViewSelectedExercise = (req: Request, res: Response) => {
  res.redirect(`/activities/exercise/${req.body.selectedExercise}`);
}

export const getViewOfSelectedExercise = async (req: Request, res: Response) => {
  const selectedExerciseId: string = req.params.exerciseId;
  
  //Fetches the exerciseNames from db if names don't exist or if the current exerciseId doesn't exist in array
  //Note: This logic is needed to fetch the new exercise info once a new exercise has been added to the db
  const index: number = _exerciseNames?.findIndex(e => e._id.toString() == selectedExerciseId);
  (index > -1) ? await fetchExerciseNames(false) : await fetchExerciseNames(true);

  ExerciseHandler.fetchById(selectedExerciseId)
  .then((selectedExerciseInfo) => {
    res.render('./activities/view-exercise', {
      caller: 'view-exercise',
      pageTitle: 'Información de ejercicio',
      exerciseNames: _exerciseNames,
      selectedExerciseInfo: selectedExerciseInfo,
      exerciseSelectOptions: ExerciseHandler.exercisesStaticValues,
      physicalConditions: PhysicalConditionHandler.physicalConditionsStaticValues.physicalConditions,
      menstrualCyclePhases: MenstrualCyclePhaseHandler.menstrualCyclePhasesStaticValues.menstrualCyclePhases
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

export const getViewToAddExercise = async (req: Request, res: Response) => {
  //Fetches the exerciseNames from db if for some reason the data was lost from previous method
  await fetchExerciseNames();

  res.render('./activities/add-exercise', {
    caller: 'add-exercise',
    pageTitle: 'Añadir ejercicio',
    exerciseNames: _exerciseNames,
    selectedExerciseInfo: null,
    physicalConditions: PhysicalConditionHandler.physicalConditionsStaticValues.physicalConditions,
    menstrualCyclePhases: MenstrualCyclePhaseHandler.menstrualCyclePhasesStaticValues.menstrualCyclePhases
  });
};

/** ACTIONS */
export const addExercise = (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);
  exerciseHandler = refactorValuesForDb(exerciseHandler);
  exerciseHandler.save().then( id => res.redirect(`/activities/exercise/${id}`) );
};

export const updateExercise = (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;
  let exercise = new ExerciseHandler(req.body);
  exercise.id = exerciseId;
  exercise = refactorValuesForDb(exercise);
  
  exercise.update()
  .then(() => {
    res.redirect(`/activities/exercise/${exerciseId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiDeleteExercise = (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;

  ExerciseHandler.deleteById(exerciseId)
  .then( deleteResponse => {
    //removes the exercise from exercises dropdown
    const index: number = _exerciseNames?.findIndex(f => f._id.toString() == exerciseId);
    if (index > -1){
      _exerciseNames.splice(index, 1);
    }

    console.log(`'${deleteResponse.name}' exercise deleted successfully.`);

    res.redirect(`/activities/exercise/`);
  })
  .catch(err => {
    console.log('Error while deleting Exercise: ', err);
  });
};

/*** FUNCTIONS */
const fetchExerciseNames = async (forceFetch = false) => {
  //Fetches the exerciseNames from db only when exerciseNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_exerciseNames || _exerciseNames.length === 0) {
    await ExerciseHandler.fetchAllNames().then((exerciseNames) => { _exerciseNames = exerciseNames});
  }
};

const refactorValuesForDb = (exercise: ExerciseHandler) => {
  exercise = refactorMealTypeValues(exercise);
  exercise.safeForConditions = refactorPhysicalConditions(exercise.safeForConditions);
  exercise.notRecommendedForConditions = refactorPhysicalConditions(exercise.notRecommendedForConditions);
  exercise.recommendedForCyclePhases = refactorCyclePhases(exercise.recommendedForCyclePhases);
  return exercise;
};

const refactorMealTypeValues = (exercise) => {
  exercise.mealType = [];

  if (exercise.breakfast) {
    exercise.mealType.push('Desayuno');
    delete exercise.breakfast;
  }
  if (exercise.lunch) {
    exercise.mealType.push('Almuerzo');
    delete exercise.lunch;
  }
  if (exercise.dinner) {
    exercise.mealType.push('Cena');
    delete exercise.dinner;
  }

  return exercise;
};

const refactorPhysicalConditions = (selectedConditions) => {
  if (!selectedConditions){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedConditions) === 'string') {
    selectedConditions = [selectedConditions]; 
  }
  //Fetches all the physical conditions to pair with their names
  if (!_conditionNames || _conditionNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _conditionNames = PhysicalConditionHandler.physicalConditionsStaticValues.physicalConditions;
  }

  let refactoredConditions: ConditionIdAndName[] = [];
  selectedConditions.forEach(conditionId => 
    {
      if (!conditionId) return; //skips empty selections

      const conditionObject: ConditionIdAndName = {
        conditionId: new ObjectId(conditionId),
        conditionName: _conditionNames.find(c => c._id === conditionId)?.name || 'Nombre no disponible'
      };

      refactoredConditions.push(conditionObject);
    });
  
  return refactoredConditions;
};

const refactorCyclePhases = (selectedPhases) => {
  if (!selectedPhases) { return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedPhases) === 'string')
  {
    selectedPhases = [selectedPhases];
  }
  
  //removes all empty options if necessary.
  return selectedPhases.filter(p => p);
};