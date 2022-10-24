//imports
import { Router } from 'express';
const router = Router();

//Controllers imports
import * as exercisesController from '../controllers/activitiesControllers/exercisesController';
import * as musclesController from '../controllers/activitiesControllers/musclesController';
import * as equipmentsController from '../controllers/activitiesControllers/equipmentsController';
import * as physicalConditionsController from '../controllers/activitiesControllers/physicalConditionsController';

/* EXERCISE */
//APIs
router.get('/exercises', exercisesController.apiGetExercises);
router.get('/exercise/:exerciseId', exercisesController.apiGetExerciseById);
router.get('/exerciseTypes', exercisesController.apiGetExerciseTypes);
router.post('/exercise', exercisesController.apiAddExercise);
router.delete('/exercise/:exerciseId', exercisesController.apiDeleteExercise);

/* MUSCLE */
//APIs
router.get('/muscles', musclesController.apiGetMuscles);
router.delete('/muscle/:muscleId', musclesController.apiDeleteMuscle);

/* EQUIPMENT */
//APIs
router.get('/equipments', equipmentsController.apiGetEquipments);
router.delete('/equipment/:equipmentId', equipmentsController.apiDeleteEquipment);

/* PHYSICAL CONDITION */
//APIs
router.get('/physicalConditions', physicalConditionsController.apiGetPhysicalConditions);
router.delete('/physicalCondition/:physicalConditionId', physicalConditionsController.apiDeletePhysicalCondition);

//exports
export default router;