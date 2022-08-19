import {Request, Response} from 'express';
import { IdAndName } from '../../util/types/nutritionTypes';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import ChronicCondition from '../../models/nutritionModels/chronicConditionModel';

let _conditionNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddChronicCondition = (req: Request, res: Response) => {
  res.redirect(`/nutrition/add-chronicCondition`);
}

export const redirectToViewSelectedChronicCondition = (req: Request, res: Response) => {
  res.redirect(`/nutrition/chronicCondition/${req.body.selectedChronicCondition}`);
}

export const getViewToSelectedChronicCondition = async (req: Request, res: Response) => {
  const selectedConditionId: string = req.params.conditionId;

  //Fetches the conditionNames from db if names don't exist or if the current conditionId doesn't exist in array
  //Note: This logic is needed to fetch the new condition info once a new condition has been added to the db
  const index: number = _conditionNames?.findIndex(f => f._id.toString() == selectedConditionId);
  (index > -1) ? await fetchConditionNames(false) : await fetchConditionNames(true);

  ChronicConditionHandler.fetchById(selectedConditionId)
  .then((selectedConditionInfo) => {
    res.render('./nutrition/view-chronicCondition', {
      caller: 'view-chronicCondition',
      pageTitle: 'Información de condición',
      conditionNames: _conditionNames,
      selectedConditionInfo: selectedConditionInfo
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

export const getViewToAddChronicCondition = async (req: Request, res: Response) => {
  //Fetches the conditionNames from db if for some reason the data was lost from previous method
  await fetchConditionNames();

  res.render('./nutrition/add-chronicCondition', {
    caller: 'add-chronicCondition',
    pageTitle: 'Añadir condición crónica',
    conditionNames: _conditionNames,
    selectedConditionInfo: null,
  });
};

/** ACTIONS */
export const addChronicCondition = (req: Request, res: Response) => {
  const chronicConditionHandler = new ChronicConditionHandler(req.body);
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
export const apiGetChronicConditions = (req: Request, res: Response) => {
  res.json(ChronicCondition.chronicConditionsStaticValues.chronicConditions);
};

export const apiDeleteChronicCondition = (req: Request, res: Response) => {
  const chronicConditionId: string = req.params.chronicConditionId;

  ChronicConditionHandler.deleteById(chronicConditionId)
  .then( deleteResponse => {
    //removes the chronicCondition from chronicConditions dropdown
    const index: number = _conditionNames?.findIndex(f => f._id.toString() == chronicConditionId);
    if (index > -1){
      _conditionNames.splice(index, 1);
    }

    console.log(`'${deleteResponse.name}' chronic condition deleted successfully.`);

    res.redirect(`/nutrition/chronicCondition/`);
  })
  .catch(err => {
    console.log('Error while deleting ChronicCondition: ', err);
  });
};

/*** FUNCTIONS */
const fetchConditionNames = async (forceFetch = false) => {
  //Fetches the conditionNames from db only when conditionNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_conditionNames || _conditionNames.length === 0) {
    // await ChronicConditionHandler.fetchAllNames().then((conditionNames) => { _conditionNames = conditionNames});
    await ChronicConditionHandler.fetchAllNames().then((conditionNames) => { _conditionNames = conditionNames });
  }
};

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