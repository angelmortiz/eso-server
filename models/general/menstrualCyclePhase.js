module.exports = class MenstrualCyclePhase {
    name;

    //TODO: DELETE ME IF NOT NEEDED
    // static menstrualCyclePhasesStaticValues = {
    //     menstrualCyclePhases: ['-- Elige --', 'Menstruación', 'Folicular', 'Ovulación', 'Lútea']
    // }

    static menstrualCyclePhasesStaticValues = {
        menstrualCyclePhases: [
            {_id: '', name: '-- Elige --'},
            {_id: 'Menstruación', name: 'Menstruación'},
            {_id: 'Folicular', name: 'Folicular'},
            {_id: 'Ovulación', name: 'Ovulación'},
            {_id: 'Lútea', name: 'Lútea'}
        ]
    }
};