import {Request, Response} from 'express';
import  *  as ResponseCodes from '../general/responseCodes';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';

/** APIS */
export const apiGetPhysicalConditions = async (req: Request, res: Response) => {
  res.json(await PhysicalConditionHandler.getAllNames());
};

export const apiGetPhysicalConditionNames = async (req: Request, res: Response) => {
  res.json(await PhysicalConditionHandler.fetchAllNames());
};

export const apiAddPhysicalCondition = (req: Request, res: Response) => {
  let physicalconditionHandler = new PhysicalConditionHandler(req.body);
  //TODO: Implement an error catcher
  physicalconditionHandler.save().then( _ => res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY()) );
};

export const apiDeletePhysicalCondition = (req: Request, res: Response) => {
  const physicalConditionId: string = req.params.physicalConditionId;

  PhysicalConditionHandler.deleteById(physicalConditionId)
  .then( deleteResponse => {
    //removes the physicalCondition from physicalConditions dropdown
    PhysicalConditionHandler.removeNameById(physicalConditionId);
    console.log(`'${deleteResponse.name}' physical condition deleted successfully.`);
    res.redirect(`/activities/physicalCondition/`);
  })
  .catch(err => {
    console.log('Error while deleting PhysicalCondition: ', err);
  });
};

/*** FUNCTIONS */
const refactorValuesForDb = (condition: PhysicalConditionHandler): PhysicalConditionHandler => {
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