import MenstrualCyclePhase from '../../models/general/menstrualCyclePhase';

const apiGetPhases = (request, response) => {
    response.json(MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases);
};

export default apiGetPhases;

