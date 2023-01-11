import {Request, Response} from 'express';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';

/** APIS */
export const apiGetChronicConditions = async (req: Request, res: Response) => {
  res.json(await ChronicConditionHandler.getAllNames());
};

export const apiDeleteChronicCondition = (req: Request, res: Response) => {
  const chronicConditionId: string = req.params.chronicConditionId;

  ChronicConditionHandler.deleteById(chronicConditionId)
  .then( deleteResponse => {
    //removes the chronicCondition from chronicConditions dropdown
    ChronicConditionHandler.removeNameById(chronicConditionId);
    console.log(`'${deleteResponse.name}' chronic condition deleted successfully.`);
    res.redirect(`/nutrition/chronicCondition/`);
  })
  .catch(err => {
    console.log('Error while deleting ChronicCondition: ', err);
  });
};