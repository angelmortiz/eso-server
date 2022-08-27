import {Request, Response} from 'express';
import { IChronicCondition } from '../../util/interfaces/nutritionInterfaces';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';

/** RENDERS */
export const redirectToViewAddChronicCondition = (req: Request, res: Response) => {
  res.redirect(`/nutrition/add-chronicCondition`);
}

export const redirectToViewSelectedChronicCondition = (req: Request, res: Response) => {
  res.redirect(`/nutrition/chronicCondition/${req.body.selectedChronicCondition}`);
}

export const getViewToSelectedChronicCondition = async (req: Request, res: Response) => {
  const selectedConditionId: string = req.params.conditionId;
  let selectedConditionInfo: IChronicCondition = {} as IChronicCondition;

  //if selectedConditionId is new, fetches all names. Otherwise, returns local list.
  const conditionNames = await ChronicConditionHandler.getAllNames(selectedConditionId);

  //gets the information of the selected condition
  await ChronicConditionHandler.fetchById(selectedConditionId)
  .then(selectedCondition =>  selectedConditionInfo = selectedCondition)
  .catch((err) => { console.log(err); return; });

  res.render('./nutrition/view-chronicCondition', {
    caller: 'view-chronicCondition',
    pageTitle: 'Información de condición crónica',
    conditionNames: conditionNames,
    selectedConditionInfo: selectedConditionInfo
  });
};

export const getViewToAddChronicCondition = async (req: Request, res: Response) => {
  res.render('./nutrition/add-chronicCondition', {
    caller: 'add-chronicCondition',
    pageTitle: 'Añadir condición crónica',
    conditionNames: await ChronicConditionHandler.getAllNames(),
    selectedConditionInfo: null,
  });
};

/** ACTIONS */
export const addChronicCondition = (req: Request, res: Response) => {
  let chronicConditionHandler = new ChronicConditionHandler(req.body);
  chronicConditionHandler = refactorValuesForDb(chronicConditionHandler);
  chronicConditionHandler.save().then( id => res.redirect(`/nutrition/chronicCondition/${id}`) );
};

export const updateChronicCondition = (req: Request, res: Response) => {
  const chronicConditionId: string = req.params.chronicConditionId;
  let chronicCondition = new ChronicConditionHandler(req.body);
  chronicCondition.id = chronicConditionId;
  chronicCondition = refactorValuesForDb(chronicCondition);

  chronicCondition.update()
  .then(() => {
    res.redirect(`/nutrition/chronicCondition/${chronicConditionId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

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