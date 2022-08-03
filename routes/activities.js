//imports
const express = require('express');
const router = express.Router();

//Controllers imports
const exercisesController = require('../controllers/activities/exercises');
const musclesController = require('../controllers/activities/muscles');
const equipmentsController = require('../controllers/activities/equipments');
const physicalConditionsController = require('../controllers/activities/physicalConditions');

/* EXERCISE */
router.get('/exercise', exercisesController.getExercise);
router.get('/add-exercise', exercisesController.getAddExercise);
router.post('/exercise', exercisesController.addExercise);

/* MUSCLE */
router.get('/muscle', musclesController.getMuscle);
router.get('/add-muscle', musclesController.getAddMuscle);

/* EQUIPMENT */
router.get('/equipment', equipmentsController.getEquipment);
router.get('/add-equipment', equipmentsController.getAddEquipment);

/* Physical Condition */
router.get('/physicalCondition', physicalConditionsController.getPhysicalCondition);
router.get('/add-physicalCondition', physicalConditionsController.getAddPhysicalCondition);

//exports
exports.routes = router;