export default class MenstrualCyclePhase {
    name: string;
    
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