import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { ConditionIdAndName, EquipmentIdAndName, MuscleIdAndName } from '../../util/types/types';
import { IExercise } from '../../util/interfaces/activitiesInterfaces';
import  *  as ResponseCodes from '../general/responseCodes';
import ExerciseHandler from '../../models/activitiesModels/exerciseModel';
import MuscleHandler from '../../models/activitiesModels/muscleModel';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

/** RENDERS */
export const redirectToViewAddExercise = (req: Request, res: Response) => {
  res.redirect(`/activities/add-exercise`);
}

export const redirectToViewSelectedExercise = (req: Request, res: Response) => {
  res.redirect(`/activities/exercise/${req.body.selectedExercise}`);
}

export const getViewToSelectedExercise = async (req: Request, res: Response) => {
  const selectedExerciseId: string = req.params.exerciseId;
  let selectedExerciseInfo: IExercise = {} as IExercise;

  //if selectedExerciseId is new, fetches all names. Otherwise, returns local list.
  const exerciseNames = await ExerciseHandler.getAllNames(selectedExerciseId);

  //gets the information of the selected exercise
  await ExerciseHandler.fetchById(selectedExerciseId)
  .then(selectedExercise => selectedExerciseInfo = selectedExercise)
  .catch((err) => { console.log(err); return; });

  res.render('./activities/view-exercise', {
    caller: 'view-exercise',
    pageTitle: 'Información de ejercicio',
    exerciseNames: exerciseNames,
    selectedExerciseInfo: selectedExerciseInfo,
    exerciseTypes: ExerciseHandler.exercisesStaticValues.types,
    muscles: await MuscleHandler.getAllNames(),
    equipments: await EquipmentHandler.getAllNames(),
    physicalConditions: await PhysicalConditionHandler.getAllNames(),
    menstrualCyclePhases: MenstrualCyclePhaseHandler.getAllNames()
  });
};

export const getViewToAddExercise = async (req: Request, res: Response) => {
  res.render('./activities/add-exercise', {
    caller: 'add-exercise',
    pageTitle: 'Añadir ejercicio',
    exerciseNames: await ExerciseHandler.getAllNames(),
    selectedExerciseInfo: null,
    exerciseTypes: ExerciseHandler.exercisesStaticValues.types,
    muscles: await MuscleHandler.getAllNames(),
    equipments: await EquipmentHandler.getAllNames(),
    physicalConditions: await PhysicalConditionHandler.getAllNames(),
    menstrualCyclePhases: MenstrualCyclePhaseHandler.getAllNames()
  });
};

/** ACTIONS */
export const addExercise = async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);
  exerciseHandler = await refactorValuesForDb(exerciseHandler);
  exerciseHandler.save().then( id => res.redirect(`/activities/exercise/${id}`) );
};

export const updateExercise = async (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;
  let exercise = new ExerciseHandler(req.body);
  exercise.id = exerciseId;
  exercise = await refactorValuesForDb(exercise);
  
  exercise.update()
  .then(() => {
    res.redirect(`/activities/exercise/${exerciseId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiGetExercises = async (req: Request, res: Response) => {
    res.json(await ExerciseHandler.fetchAll());
};

export const apiGetExerciseNames = async (req: Request, res: Response) => {
    res.json(await ExerciseHandler.fetchAllNames());
};

export const apiGetExerciseById = async (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;

  res.json(await ExerciseHandler.fetchById(exerciseId));
};

export const apiGetExerciseTypes = (req: Request, res: Response) => {
    res.json(ExerciseHandler.exercisesStaticValues.types);
};

export const apiAddExercise = async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);

  //TODO: Implement an error catcher
  exerciseHandler.save().then( _ => res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY()) );
};

export const apiUpdateExercise = async (req: Request, res: Response) => {
  let exerciseHandler = new ExerciseHandler(req.body);
  
  //TODO: Implement an error catcher
  exerciseHandler.update().then( _ => res.json(ResponseCodes.RESPONSE_UPDATED_SUCCESSFULLY()) );
};

export const apiDeleteExercise = (req: Request, res: Response) => {
  const exerciseId: string = req.params.exerciseId;

  ExerciseHandler.deleteById(exerciseId)
  .then( deleteResponse => {
    //removes the exercise from exercises dropdown
    //removes the food from foods dropdown
    ExerciseHandler.removeNameById(exerciseId);
    console.log(`'${deleteResponse.name}' exercise deleted successfully.`);
    res.json(ResponseCodes.RESPONSE_DELETED_SUCCESSFULLY())
  })
  .catch(err => {
    console.log('Error while deleting Exercise: ', err);
    res.json(ResponseCodes.RESPONSE_DELETE_FAILED())
  });
};

/*** FUNCTIONS */
const refactorValuesForDb = async (exercise: ExerciseHandler) => {
    exercise.compoundMovement = refactorCompoundMovement(exercise.compoundMovement);
    console.log("here 1");
    exercise.mainMuscle = await refactorMainMuscle(exercise.mainMuscle);
    console.log("here 2");
    exercise.secondaryMuscles = await refactorSecondaryMuscles(exercise.secondaryMuscles);
    exercise.types = refactorTypes(exercise.types);
    exercise.equipments = await refactorEquipments(exercise.equipments);
    exercise.safeForConditions = await refactorPhysicalConditions(exercise.safeForConditions);
    exercise.notRecommendedForConditions = await refactorPhysicalConditions(exercise.notRecommendedForConditions);
  exercise.recommendedForCyclePhases = refactorCyclePhases(exercise.recommendedForCyclePhases);
  return exercise;
};

const refactorCompoundMovement = (movement) => {
    return movement === 'yes';
};

const refactorMainMuscle = async (muscleId) => {
    if (!muscleId) {return null; }
    
    //Fetches all the muscles to pair with their names
    const _muscleNames = await MuscleHandler.getAllNames();

    const muscleObject: MuscleIdAndName = {
        muscleId: new ObjectId(muscleId),
        muscleName: _muscleNames.find(c => c._id === muscleId)?.name || 'Nombre no disponible'
    };

    return muscleObject;
};

const refactorSecondaryMuscles = async (muscles) => {
    if (!muscles){ return null; }
  
    //Handles cases when the user only chooses one option and form returns a string
    if (typeof(muscles) === 'string') {
      muscles = [muscles]; 
    }

   //Fetches all the muscles to pair with their names
   const _muscleNames = await MuscleHandler.getAllNames();
  
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
const refactorEquipments = async (equipments) => {
    if (!equipments){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(equipments) === 'string') {
    equipments = [equipments]; 
  }
  //Fetches all the equipments to pair with their names
  const _equipmentNames = await EquipmentHandler.getAllNames();

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

const refactorPhysicalConditions = async (selectedConditions) => {
  if (!selectedConditions){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedConditions) === 'string') {
    selectedConditions = [selectedConditions]; 
  }
  //Fetches all the physical conditions to pair with their names
  const _conditionNames = await PhysicalConditionHandler.getAllNames();

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