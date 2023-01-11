import {Request, Response} from 'express';
import MenstrualCyclePhaseHandler from '../../models/cycleModels/menstrualCyclePhaseModel';

export const apiGetPhases = async (req: Request, res: Response) => {
    res.json(MenstrualCyclePhaseHandler.menstrualCyclePhasesStaticValues.menstrualCyclePhases);
};