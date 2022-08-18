import MenstrualCyclePhase from '../../models/general/menstrualCyclePhase';

export const apiGetPhases = (request, response) => {
    response.json(MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases);
};