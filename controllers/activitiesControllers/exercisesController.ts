

import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { ConditionIdAndName, EquipmentIdAndName, IdAndName, MuscleIdAndName } from '../../util/types/types';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import MuscleHandler from '../../models/activitiesModels/muscleModel';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

let _exerciseNames: IdAndName[] = [];
let _muscleNames: IdAndName[] = [];
let _equipmentNames: IdAndName[] = [];
let _conditionNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddExercise = (req: Request, res: Response) => {
  res.redirect(`/activities/add-exercise`);
}

export const redirectToViewSelectedExercise = (req: Request, res: Response) => {
  res.redirect(`/activities/exercise/${req.body.selectedExercise}`);
}

export const getViewToSelectedExercise = async (req: Request, res: Response) => {
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
    exerciseTypes: ExerciseHandler.exercisesStaticValues.types,
    muscles: MuscleHandler.musclesStaticValues.muscles,
    equipments: EquipmentHandler.equipmentsStaticValues.equipments,
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
export const apiGetExercises = (req: Request, res: Response) => {
    res.json(ExerciseHandler.exercisesStaticValues.exercises);
};

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
    exercise.compoundMovement = refactorCompoundMovement(exercise.compoundMovement);
    exercise.mainMuscle = refactorMainMuscle(exercise.mainMuscle);
    exercise.secondaryMuscles = refactorSecondaryMuscles(exercise.secondaryMuscles);
    exercise.types = refactorTypes(exercise.types);
    exercise.equipments = refactorEquipments(exercise.equipments);
    exercise.safeForConditions = refactorPhysicalConditions(exercise.safeForConditions);
    exercise.notRecommendedForConditions = refactorPhysicalConditions(exercise.notRecommendedForConditions);
  exercise.recommendedForCyclePhases = refactorCyclePhases(exercise.recommendedForCyclePhases);
  return exercise;
};

const refactorCompoundMovement = (movement) => {
    return movement === 'yes';
};

const refactorMainMuscle = (muscleId) => {
    if (!muscleId) {return null; }
    
    //Fetches all the muscles to pair with their names
    if (!_muscleNames || _muscleNames.length === 0) {
        //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
        _muscleNames = MuscleHandler.musclesStaticValues.muscles;
    }

    const muscleObject: MuscleIdAndName = {
        muscleId: new ObjectId(muscleId),
        muscleName: _muscleNames.find(c => c._id === muscleId)?.name || 'Nombre no disponible'
    };

    return muscleObject;
};

const refactorSecondaryMuscles = (muscles) => {
    if (!muscles){ return null; }
  
    //Handles cases when the user only chooses one option and form returns a string
    if (typeof(muscles) === 'string') {
      muscles = [muscles]; 
    }

    //Fetches all the muscles to pair with their names
    if (!_muscleNames || _muscleNames.length === 0) {
        //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
        _muscleNames = MuscleHandler.musclesStaticValues.muscles;
    }
  
    let refactoredMuscles: MuscleIdAndName[] = [];
    muscles.forEach(muscleId => 
      {
        if (!muscleId) return; //skips empty selections
  
        const muscleObject: MuscleIdAndName = {
          muscleId: new ObjectId(muscleId),
          muscleName: _muscleNames.find(c => c._id === muscleId)?.name || 'Nombre no disponible'
        };
  
        refactoredMuscles.push(muscleObject);
      });
    
    return refactoredMuscles;
  };

const refactorTypes = (types) => {
    if (!types){ return null; }

    //Handles cases when the user only chooses one option and form returns a string
    if (typeof(types) === 'string') {
        types = [types]; 
    }

    return types;
};

//TODO: Create one reusable and abstract method to handle similar refactors functionns
const refactorEquipments = (equipments) => {
    if (!equipments){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(equipments) === 'string') {
    equipments = [equipments]; 
  }
  //Fetches all the equipments to pair with their names
  if (!_equipmentNames || _equipmentNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _equipmentNames = EquipmentHandler.equipmentsStaticValues.equipments;
  }

  let refactoredEquipments: EquipmentIdAndName[] = [];
  equipments.forEach(equipmentId => 
    {
      if (!equipmentId) return; //skips empty selections

      const equipmentObject: EquipmentIdAndName = {
        equipmentId: new ObjectId(equipmentId),
        equipmentName: _equipmentNames.find(c => c._id === equipmentId)?.name || 'Nombre no disponible'
      };

      refactoredEquipments.push(equipmentObject);
    });
  
  return refactoredEquipments;
}

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