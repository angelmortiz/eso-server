//imports
import { Router } from 'express';
const router = Router();

//Controllers imports
import * as exercisesController from '../controllers/activitiesControllers/exercisesController';
import * as musclesController from '../controllers/activitiesControllers/musclesController';
import * as equipmentsController from '../controllers/activitiesControllers/equipmentsController';
import * as physicalConditionsController from '../controllers/activitiesControllers/physicalConditionsController';

/* EXERCISE */
//Renders
router.get('/exercise', exercisesController.getViewToAddExercise);
router.get('/exercise/:exerciseId', exercisesController.getViewToSelectedExercise);
router.get('/add-exercise', exercisesController.getViewToAddExercise);
//Actions
router.post('/exercise', exercisesController.addExercise);
router.post('/update-exercise/:exerciseId', exercisesController.updateExercise);
router.post('/redirect-to-view-selected-exercise', exercisesController.redirectToViewSelectedExercise);
//APIs
router.get('/exercises', exercisesController.apiGetExercises);
router.delete('/exercise/:exerciseId', exercisesController.apiDeleteExercise);

/* MUSCLE */
//Renders
router.get('/muscle', musclesController.getViewToAddMuscle);
router.get('/muscle/:muscleId', musclesController.getViewToSelectedMuscle);
router.get('/add-muscle', musclesController.getViewToAddMuscle);
//Actions
router.post('/muscle', musclesController.addMuscle);
router.post('/update-muscle/:muscleId', musclesController.updateMuscle);
router.post('/redirect-to-view-selected-muscle', musclesController.redirectToViewSelectedMuscle);
//APIs
router.get('/muscles', musclesController.apiGetMuscles);
router.delete('/muscle/:muscleId', musclesController.apiDeleteMuscle);

/* EQUIPMENT */
//Renders
router.get('/equipment', equipmentsController.getViewToAddEquipment);
router.get('/equipment/:equipmentId', equipmentsController.getViewToSelectedEquipment);
router.get('/add-equipment', equipmentsController.getViewToAddEquipment);
//Actions
router.post('/equipment', equipmentsController.addEquipment);
router.post('/update-equipment/:equipmentId', equipmentsController.updateEquipment);
router.post('/redirect-to-view-selected-equipment', equipmentsController.redirectToViewSelectedEquipment);
//APIs
router.get('/equipments', equipmentsController.apiGetEquipments);
router.delete('/equipment/:equipmentId', equipmentsController.apiDeleteEquipment);

/* PHYSICAL CONDITION */
//Renders
router.get('/physicalCondition', physicalConditionsController.getViewToAddPhysicalCondition);
router.get('/physicalCondition/:conditionId', physicalConditionsController.getViewToSelectedPhysicalCondition);
router.get('/add-physicalCondition', physicalConditionsController.getViewToAddPhysicalCondition);
//Actions
router.post('/physicalCondition', physicalConditionsController.addPhysicalCondition);
router.post('/update-physicalCondition/:physicalConditionId', physicalConditionsController.updatePhysicalCondition);
router.post('/redirect-to-view-selected-physicalCondition', physicalConditionsController.redirectToViewSelectedPhysicalCondition);
//APIs
router.get('/physicalConditions', physicalConditionsController.apiGetPhysicalConditions);
router.delete('/physicalCondition/:physicalConditionId', physicalConditionsController.apiDeletePhysicalCondition);

//exports
export default router;