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

/*** FUNCTIONS */
const refactorValuesForDb = (condition: ChronicConditionHandler): ChronicConditionHandler => {
  condition.symptoms = removeEmptyValues(condition.symptoms);
  condition.causes = removeEmptyValues(condition.causes);
  condition.treatments = removeEmptyValues(condition.treatments);
  condition.tests = removeEmptyValues(condition.tests);
  return condition;
};

const removeEmptyValues = (values: string[]): string[] => {
  if (!values) return [];

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(values) === 'string')
  {
    values = [values];
  }

  //removes all empty options if necessary.
  return values.filter(v => v);
}