import {Request, Response} from 'express';
import { IdAndName } from '../../util/types/types';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';

let _conditionNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddPhysicalCondition = (req: Request, res: Response) => {
  res.redirect(`/activities/add-physicalCondition`);
}

export const redirectToViewSelectedPhysicalCondition = (req: Request, res: Response) => {
  res.redirect(`/activities/physicalCondition/${req.body.selectedPhysicalCondition}`);
}

export const getViewToSelectedPhysicalCondition = async (req: Request, res: Response) => {
  const selectedConditionId: string = req.params.conditionId;

  //Fetches the conditionNames from db if names don't exist or if the current conditionId doesn't exist in array
  //Note: This logic is needed to fetch the new condition info once a new condition has been added to the db
  const index: number = _conditionNames?.findIndex(f => f._id.toString() == selectedConditionId);
  (index > -1) ? await fetchConditionNames(false) : await fetchConditionNames(true);

  PhysicalConditionHandler.fetchById(selectedConditionId)
  .then((selectedConditionInfo) => {
    res.render('./activities/view-physicalCondition', {
      caller: 'view-physicalCondition',
      pageTitle: 'Información de condición física',
      conditionNames: _conditionNames,
      selectedConditionInfo: selectedConditionInfo
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

export const getViewToAddPhysicalCondition = async (req: Request, res: Response) => {
  //Fetches the conditionNames from db if for some reason the data was lost from previous method
  await fetchConditionNames();

  res.render('./activities/add-physicalCondition', {
    caller: 'add-physicalCondition',
    pageTitle: 'Añadir condición física',
    conditionNames: _conditionNames,
    selectedConditionInfo: null,
  });
};

/** ACTIONS */
export const addPhysicalCondition = (req: Request, res: Response) => {
  const physicalConditionHandler = new PhysicalConditionHandler(req.body);
  physicalConditionHandler.save().then( id => res.redirect(`/activities/physicalCondition/${id}`) );
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
export const apiGetPhysicalConditions = (req: Request, res: Response) => {
  res.json(PhysicalConditionHandler.physicalConditionsStaticValues.physicalConditions);
};

export const apiDeletePhysicalCondition = (req: Request, res: Response) => {
  const physicalConditionId: string = req.params.physicalConditionId;

  PhysicalConditionHandler.deleteById(physicalConditionId)
  .then( deleteResponse => {
    //removes the physicalCondition from physicalConditions dropdown
    const index: number = _conditionNames?.findIndex(f => f._id.toString() == physicalConditionId);
    if (index > -1){
      _conditionNames.splice(index, 1);
    }

    console.log(`'${deleteResponse.name}' physical condition deleted successfully.`);

    res.redirect(`/activities/physicalCondition/`);
  })
  .catch(err => {
    console.log('Error while deleting PhysicalCondition: ', err);
  });
};

/*** FUNCTIONS */
const fetchConditionNames = async (forceFetch = false) => {
  //Fetches the conditionNames from db only when conditionNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_conditionNames || _conditionNames.length === 0) {
    // await PhysicalConditionHandler.fetchAllNames().then((conditionNames) => { _conditionNames = conditionNames});
    await PhysicalConditionHandler.fetchAllNames().then((conditionNames) => { _conditionNames = conditionNames });
  }
};

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