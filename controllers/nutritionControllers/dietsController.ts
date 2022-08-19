import {Request, Response} from 'express';
import { IdAndName } from '../../util/types/nutritionTypes';
import ChronicChonditionModel from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';
import Diet from '../../models/nutritionModels/dietModel';

let _dietNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddDiet = (req: Request, res: Response) => {
  res.redirect(`/nutrition/add-diet`);
}

export const redirectToViewSelectedDiet = (req: Request, res: Response) => {
  res.redirect(`/nutrition/diet/${req.body.selectedDiet}`);
}

export const getDiet = (req: Request, res: Response) => {
  res.render('./nutrition/view-diet', {
    caller: 'view-diet',
    pageTitle: 'Información de dieta',
  });
};

export const getViewToAddDiet = async (req: Request, res: Response) => {
  //Fetches the dietNames from db if for some reason the data was lost from previous method
  await fetchDietNames();

  res.render('./nutrition/add-diet', {
    caller: 'add-diet',
    pageTitle: 'Añadir dieta',
    dietNames: _dietNames,
    selectedDietInfo: null,
    chronicConditions: ChronicChonditionModel.chronicConditionsStaticValues.chronicConditions,
  });
};

/** ACTIONS */
export const addDiet = (req: Request, res: Response) => {
  const dietHandler = new DietHandler(req.body);
  dietHandler.save().then( id => res.redirect(`/nutrition/diet/${id}`) );
};

/** APIS */
export const apiGetDiets = (req: Request, res: Response) => {
  res.json(Diet.compatibleWithDietsStaticValues.diets);
};

/*** FUNCTIONS */
const fetchDietNames = async (forceFetch = false) => {
  //Fetches the dietNames from db only when dietNames is not available or when forced
  //Note: This is forced to fetch when a new value has been added to the database
  if (forceFetch || !_dietNames || _dietNames.length === 0) {
    // await DietHandler.fetchAllNames().then((dietNames) => { _dietNames = dietNames});
    await DietHandler.fetchAllNames().then((dietNames) => { _dietNames = dietNames });
  }
};