//imports
const express = require('express');
const router = express.Router();

//Controllers imports
const exercisesController = require('../controllers/activitiesControllers/exercisesController');
const musclesController = require('../controllers/activitiesControllers/musclesController');
const equipmentsController = require('../controllers/activitiesControllers/equipmentsController');
const physicalConditionsController = require('../controllers/activitiesControllers/physicalConditionsController');

/* EXERCISE */
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
exports.routes = router;