import {Request, Response} from 'express';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import ChronicCondition from '../../models/nutritionModels/chronicConditionModel';
import { IdAndName } from '../../util/types/nutritionTypes';

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

export const addChronicCondition = (req: Request, res: Response) => {
  let chronicConditionHandler = new ChronicConditionHandler(req.body);

  console.log('chronicConditionHandler', chronicConditionHandler);
  chronicConditionHandler.save().then( id => res.redirect(`/nutrition/chronicCondition/${id}`) );
};

export const apiGetChronicConditions = (req: Request, res: Response) => {
  res.json(ChronicCondition.chronicConditionsStaticValues.chronicConditions);
};

/*** FUNCTIONS */
let fetchConditionNames = async (forceFetch = false) => {
  //Fetches the conditionNames from db only when conditionNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_conditionNames || _conditionNames.length === 0) {
    // await ChronicConditionHandler.fetchAllNames().then((conditionNames) => { _conditionNames = conditionNames});
    await ChronicConditionHandler.fetchAllNames().then((conditionNames) => { 
      
      console.log(`conditionNames`, conditionNames);
      _conditionNames = conditionNames;
    });
  }
};