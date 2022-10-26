import {Request, Response} from 'express';
import { IPhysicalCondition } from '../../util/interfaces/activitiesInterfaces';
import  *  as ResponseCodes from '../general/responseCodes';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';

/** RENDERS */
export const redirectToViewAddPhysicalCondition = (req: Request, res: Response) => {
  res.redirect(`/activities/add-physicalCondition`);
}

export const redirectToViewSelectedPhysicalCondition = (req: Request, res: Response) => {
  res.redirect(`/activities/physicalCondition/${req.body.selectedPhysicalCondition}`);
}

export const getViewToSelectedPhysicalCondition = async (req: Request, res: Response) => {
  const selectedConditionId: string = req.params.conditionId;
  let selectedConditionInfo: IPhysicalCondition = {} as IPhysicalCondition;

  //if selectedConditionId is new, fetches all names. Otherwise, returns local list.
  const conditionNames = await PhysicalConditionHandler.getAllNames(selectedConditionId);

  //gets the information of the selected condition
  await PhysicalConditionHandler.fetchById(selectedConditionId)
  .then(selectedCondition => selectedConditionInfo = selectedCondition)
  .catch((err) => { console.log(err); return; });

  res.render('./activities/view-physicalCondition', {
    caller: 'view-physicalCondition',
    pageTitle: 'Información de condición física',
    conditionNames: conditionNames,
    selectedConditionInfo: selectedConditionInfo
  });
};

export const getViewToAddPhysicalCondition = async (req: Request, res: Response) => {
  res.render('./activities/add-physicalCondition', {
    caller: 'add-physicalCondition',
    pageTitle: 'Añadir condición física',
    conditionNames: await PhysicalConditionHandler.getAllNames(),
    selectedConditionInfo: null,
  });
};

/** ACTIONS */
export const addPhysicalCondition = (req: Request, res: Response) => {
  let physicalCondition = new PhysicalConditionHandler(req.body);
  physicalCondition = refactorValuesForDb(physicalCondition);
  physicalCondition.save().then( id => res.redirect(`/activities/physicalCondition/${id}`) );
};

export const updatePhysicalCondition = (req: Request, res: Response) => {
  const physicalConditionId: string = req.params.physicalConditionId;
  let physicalCondition = new PhysicalConditionHandler(req.body);
  physicalCondition.id = physicalConditionId;
  physicalCondition = refactorValuesForDb(physicalCondition);

  physicalCondition.update()
  .then(() => {
    res.redirect(`/activities/physicalCondition/${physicalConditionId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiGetPhysicalConditions = async (req: Request, res: Response) => {
  res.json(await PhysicalConditionHandler.getAllNames());
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