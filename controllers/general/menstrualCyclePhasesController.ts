import {Request, Response} from 'express';
import MenstrualCyclePhaseHandler from '../../models/generalModels/menstrualCyclePhaseModel';

export const apiGetPhases = (req: Request, res: Response) => {
    res.json(MenstrualCyclePhaseHandler.menstrualCyclePhasesStaticValues.menstrualCyclePhases);
};