const MenstrualCyclePhase = require('../../models/general/menstrualCyclePhase');

exports.apiGetPhases = (request, response) => {
    response.json(MenstrualCyclePhase.menstrualCyclePhasesStaticValues.menstrualCyclePhases);
};
