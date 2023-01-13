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
router.delete('/equipment/:equipmentId', equipmentsController.apiDeleteEquipment);

/* PHYSICAL CONDITION */
//APIs
router.get('/physicalConditions', physicalConditionsController.apiGetPhysicalConditions);
router.get('/physicalconditionNames', physicalConditionsController.apiGetPhysicalConditionNames);
router.get('/physicalcondition/:physicalconditionId', physicalConditionsController.apiGetPhysicalConditionById);
router.post('/physicalcondition', physicalConditionsController.apiAddPhysicalCondition);
router.put('/physicalcondition/:physicalconditionId', physicalConditionsController.apiUpdatePhysicalCondition);
router.delete('/physicalcondition/:physicalconditionId', physicalConditionsController.apiDeletePhysicalCondition);

//exports
export default router;