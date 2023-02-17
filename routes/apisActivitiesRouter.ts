//imports
import { restrictAccessTo } from '../controllers/userControllers/userAuthController';
import { Router } from 'express';
const router = Router();

//Controllers imports
import * as programPlansController from '../controllers/activitiesControllers/programPlanController';
import * as programsController from '../controllers/activitiesControllers/programsController';
import * as workoutsController from '../controllers/activitiesControllers/workoutsController';
import * as exercisesController from '../controllers/activitiesControllers/exercisesController';
import * as musclesController from '../controllers/activitiesControllers/musclesController';
import * as equipmentsController from '../controllers/activitiesControllers/equipmentsController';
import * as physicalConditionsController from '../controllers/activitiesControllers/physicalConditionsController';

/* PROGRAM PLAN */
router.get(
  '/programPlan/:programPlanId',
  programPlansController.apiGetProgramPlanById
);
router.get(
  '/programPlan/logs/:programPlanId',
  programPlansController.apiGetProgramPlanLogsById
);
router.get(
  '/programPlan/logs/:programPlanId/weekNumber/:weekNumber/workout/:workoutId',
  programPlansController.apiGetWorkoutLogsById
);
router.get(
  '/programPlans/assignedTo/currentUser',
  programPlansController.apiGetAssignedProgramPlans
);
router.get(
  '/programPlans/assignedTo/currentUser/:filter',
  programPlansController.apiGetAssignedProgramPlans
);
router.get(
  '/programPlans/assignedTo/:userId',
  programPlansController.apiGetAssignedProgramPlans
);
router.post(
  '/programPlan',
  restrictAccessTo('Admin', 'Editor'),
  programPlansController.apiAddProgramPlan
);
router.put(
  '/programPlan/:programPlanId',
  restrictAccessTo('Admin', 'Editor'),
  programsController.apiUpdateProgram
);
router.delete(
  '/programPlan/:programPlanId',
  restrictAccessTo('Admin', 'Editor'),
  programsController.apiDeleteProgram
);

/* PROGRAM */
//APIs
router.get('/programs', programsController.apiGetPrograms);
router.get('/programNames', programsController.apiGetProgramNames);
router.get('/program/:programId', programsController.apiGetProgramById);
router.post('/program', programsController.apiAddProgram);
router.put('/program/:programId', programsController.apiUpdateProgram);
router.delete('/program/:programId', programsController.apiDeleteProgram);

/* WORKOUT */
//APIs
router.get('/workouts', workoutsController.apiGetWorkouts);
router.get('/workoutNames', workoutsController.apiGetWorkoutNames);
router.get('/workout/:workoutId', workoutsController.apiGetWorkoutById);
router.post('/workout', workoutsController.apiAddWorkout);
router.put('/workout/:workoutId', workoutsController.apiUpdateWorkout);
router.delete('/workout/:workoutId', workoutsController.apiDeleteWorkout);

/* EXERCISE */
//APIs
router.get('/exercises', exercisesController.apiGetExercises);
router.get('/exerciseNames', exercisesController.apiGetExerciseNames);
router.get('/exercise/:exerciseId', exercisesController.apiGetExerciseById);
router.get('/exerciseTypes', exercisesController.apiGetExerciseTypes);
router.post('/exercise', exercisesController.apiAddExercise);
router.put('/exercise/:exerciseId', exercisesController.apiUpdateExercise);
router.delete('/exercise/:exerciseId', exercisesController.apiDeleteExercise);

/* MUSCLE */
//APIs
router.get('/muscles', musclesController.apiGetMuscles);
router.get('/muscleNames', musclesController.apiGetMuscleNames);
router.get('/muscle/:muscleId', musclesController.apiGetMuscleById);
router.post('/muscle', musclesController.apiAddMuscle);
router.put('/muscle/:muscleId', musclesController.apiUpdateMuscle);
router.delete('/muscle/:muscleId', musclesController.apiDeleteMuscle);

/* EQUIPMENT */
//APIs
router.get('/equipments', equipmentsController.apiGetEquipments);
router.get('/equipmentNames', equipmentsController.apiGetEquipmentNames);
router.get('/equipment/:equipmentId', equipmentsController.apiGetEquipmentById);
router.post('/equipment', equipmentsController.apiAddEquipment);
router.put('/equipment/:equipmentId', equipmentsController.apiUpdateEquipment);
router.delete(
  '/equipment/:equipmentId',
  equipmentsController.apiDeleteEquipment
);

/* PHYSICAL CONDITION */
//APIs
router.get(
  '/physicalConditions',
  physicalConditionsController.apiGetPhysicalConditions
);
router.get(
  '/physicalconditionNames',
  physicalConditionsController.apiGetPhysicalConditionNames
);
router.get(
  '/physicalcondition/:physicalconditionId',
  physicalConditionsController.apiGetPhysicalConditionById
);
router.post(
  '/physicalcondition',
  physicalConditionsController.apiAddPhysicalCondition
);
router.put(
  '/physicalcondition/:physicalconditionId',
  physicalConditionsController.apiUpdatePhysicalCondition
);
router.delete(
  '/physicalcondition/:physicalconditionId',
  physicalConditionsController.apiDeletePhysicalCondition
);

//exports
export default router;
