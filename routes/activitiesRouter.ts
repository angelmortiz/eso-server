//imports
import { Router } from 'express';
const router = Router();

//Controllers imports
import * as exercisesController from '../controllers/activitiesControllers/exercisesController';
import * as musclesController from '../controllers/activitiesControllers/musclesController';
import * as equipmentsController from '../controllers/activitiesControllers/equipmentsController';
import * as physicalConditionsController from '../controllers/activitiesControllers/physicalConditionsController';

/* EXERCISE */
router.get('/', exercisesController.getExercise); //defeault render for activities
router.get('/exercise', exercisesController.getExercise);
router.get('/add-exercise', exercisesController.getAddExercise);
router.post('/exercise', exercisesController.addExercise);

/* MUSCLE */
router.get('/muscle', musclesController.getMuscle);
router.get('/add-muscle', musclesController.getAddMuscle);
router.post('/muscle', musclesController.addMuscle);

/* EQUIPMENT */
//Renders
router.get('/equipment', equipmentsController.getViewToAddEquipment);
router.get('/equipment/:conditionId', equipmentsController.getViewToSelectedEquipment);
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