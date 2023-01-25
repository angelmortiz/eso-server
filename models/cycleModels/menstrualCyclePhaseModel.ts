import { IdAndName } from "../../util/types/types";

export default class MenstrualCyclePhase {
    name: string;
    
    static _names: IdAndName[];

    static getAllNames() {
        return this.menstrualCyclePhasesStaticValues.menstrualCyclePhases;
    }

    static menstrualCyclePhasesStaticValues = {
        menstrualCyclePhases: [
            {_id: 'Menstruación', name: 'Menstruación'},
            {_id: 'Folicular', name: 'Folicular'},
            {_id: 'Ovulación', name: 'Ovulación'},
            {_id: 'Lútea', name: 'Lútea'}
        ]
    }
};