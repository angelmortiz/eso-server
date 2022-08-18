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
router.get('/equipment', equipmentsController.getEquipment);
router.get('/add-equipment', equipmentsController.getAddEquipment);
router.post('/equipment', equipmentsController.addEquipment);

/* Physical Condition */
router.get('/physicalCondition', physicalConditionsController.getPhysicalCondition);
router.get('/add-physicalCondition', physicalConditionsController.getAddPhysicalCondition);
router.post('/physicalCondition', physicalConditionsController.addPhysicalCondition);

//exports
export default router;