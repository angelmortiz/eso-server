import {Request, Response} from 'express';
import { ObjectId } from 'mongodb';
import { ConditionIdAndName, IdAndName } from '../../util/types/types';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';

let _dietNames: IdAndName[] = [];
let _conditionNames: IdAndName[] = [];

/** RENDERS */
export const redirectToViewAddDiet = (req: Request, res: Response) => {
  res.redirect(`/nutrition/add-diet`);
}

export const redirectToViewSelectedDiet = (req: Request, res: Response) => {
  res.redirect(`/nutrition/diet/${req.body.selectedDiet}`);
}

export const getViewOfSelectedDiet = async (req: Request, res: Response) => {
  const selectedDietId: string = req.params.dietId;
  
  //Fetches the dietNames from db if names don't exist or if the current dietId doesn't exist in array
  //Note: This logic is needed to fetch the new diet info once a new diet has been added to the db
  const index: number = _dietNames?.findIndex(f => f._id.toString() == selectedDietId);
  (index > -1) ? await fetchDietNames(false) : await fetchDietNames(true);

  DietHandler.fetchById(selectedDietId)
  .then((selectedDietInfo) => {
    res.render('./nutrition/view-diet', {
      caller: 'view-diet',
      pageTitle: 'Información de dieta',
      dietNames: _dietNames,
      selectedDietInfo: selectedDietInfo,
      chronicConditions: ChronicConditionHandler.chronicConditionsStaticValues.chronicConditions
    });
  })
  .catch((err) => {
    console.log(err);
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
    chronicConditions: ChronicConditionHandler.chronicConditionsStaticValues.chronicConditions,
  });
};

/** ACTIONS */
export const addDiet = (req: Request, res: Response) => {
  let dietHandler = new DietHandler(req.body);
  dietHandler = refactorValuesForDb(dietHandler);
  dietHandler.save().then( id => res.redirect(`/nutrition/diet/${id}`) );
};

export const updateDiet = (req: Request, res: Response) => {
  const dietId: string = req.params.dietId;
  let diet = new DietHandler(req.body);
  diet.id = dietId;
  diet = refactorValuesForDb(diet);
  
  diet.update()
  .then(() => {
    res.redirect(`/nutrition/diet/${dietId}`);
  })
  .catch((err) => {
    console.log('Error while inserting document to db', err);
  });
};

/** APIS */
export const apiGetDiets = (req: Request, res: Response) => {
  res.json(DietHandler.compatibleWithDietsStaticValues.diets);
};

export const apiDeleteDiet = (req: Request, res: Response) => {
  const dietId: string = req.params.dietId;

  DietHandler.deleteById(dietId)
  .then( deleteResponse => {
    //removes the diet from diets dropdown
    const index: number = _dietNames?.findIndex(f => f._id.toString() == dietId);
    if (index > -1){
      _dietNames.splice(index, 1);
    }

    console.log(`'${deleteResponse.name}' diet deleted successfully.`);

    res.redirect(`/nutrition/diet/`);
  })
  .catch(err => {
    console.log('Error while deleting Diet: ', err);
  });
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

const refactorValuesForDb = (diet: DietHandler) => {
  diet.safeForConditions = refactorChronicConditions(diet.safeForConditions);
  return diet;
};

const refactorChronicConditions = (selectedConditions) => {
  if (!selectedConditions){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedConditions) === 'string') {
    selectedConditions = [selectedConditions]; 
  }
  //Fetches all the chronic conditions to pair with their names
  if (!_conditionNames || _conditionNames.length === 0) {
    //TODO: CHANGE THIS LOGIC FOR REAL DB FETCH
    _conditionNames = ChronicConditionHandler.chronicConditionsStaticValues.chronicConditions;
  }

  let refactoredConditions: ConditionIdAndName[] = [];
  selectedConditions.forEach(conditionId => 
    {
      if (!conditionId) return; //skips empty selections

      const conditionObject: ConditionIdAndName = {
        conditionId: new ObjectId(conditionId),
        conditionName: _conditionNames.find(c => c._id === conditionId)?.name || 'Nombre no disponible'
      };

      refactoredConditions.push(conditionObject);
    });
  
  return refactoredConditions;
};