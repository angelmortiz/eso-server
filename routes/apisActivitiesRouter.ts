//imports
import * as authController from '../controllers/authController';
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
router.post('/muscle', musclesController.apiAddMuscle);
router.delete('/muscle/:muscleId', musclesController.apiDeleteMuscle);

/* EQUIPMENT */
//APIs
router.get('/equipments', equipmentsController.apiGetEquipments);
router.get('/equipmentNames', equipmentsController.apiGetEquipmentNames);
router.post('/equipment', equipmentsController.apiAddEquipment);
router.delete('/equipment/:equipmentId', equipmentsController.apiDeleteEquipment);

/* PHYSICAL CONDITION */
//APIs
router.get('/physicalConditions', physicalConditionsController.apiGetPhysicalConditions);
router.get('/physicalConditionNames', physicalConditionsController.apiGetPhysicalConditionNames);
router.post('/physicalCondition', physicalConditionsController.apiAddPhysicalCondition);
router.delete('/physicalCondition/:physicalConditionId', physicalConditionsController.apiDeletePhysicalCondition);

//exports
export default router;