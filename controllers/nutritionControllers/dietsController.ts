import {Request, Response} from 'express';
import { ObjectId } from 'mongodb';
import { ConditionIdAndName } from '../../util/types/types';
import { IDiet } from '../../util/interfaces/nutritionInterfaces';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';

/** RENDERS */
export const redirectToViewAddDiet = (req: Request, res: Response) => {
  res.redirect(`/nutrition/add-diet`);
}

export const redirectToViewSelectedDiet = (req: Request, res: Response) => {
  res.redirect(`/nutrition/diet/${req.body.selectedDiet}`);
}

export const getViewToSelectedDiet = async (req: Request, res: Response) => {
  const selectedDietId: string = req.params.dietId;
  let selectedDietInfo: IDiet = {} as IDiet;

  //if selectedDietId is new, fetches all names. Otherwise, returns local list.
  const dietNames = await DietHandler.getAllNames(selectedDietId);

  await DietHandler.fetchById(selectedDietId)
  .then(selectedDiet => selectedDietInfo = selectedDiet)
  .catch((err) => { console.log(err); return; });

  res.render('./nutrition/view-diet', {
    caller: 'view-diet',
    pageTitle: 'Información de dieta',
    dietNames: dietNames,
    selectedDietInfo: selectedDietInfo,
    chronicConditions: await ChronicConditionHandler.getAllNames()
  });
};

export const getViewToAddDiet = async (req: Request, res: Response) => {
  res.render('./nutrition/add-diet', {
    caller: 'add-diet',
    pageTitle: 'Añadir dieta',
    dietNames: await DietHandler.getAllNames(),
    selectedDietInfo: null,
    chronicConditions: await ChronicConditionHandler.getAllNames(),
  });
};

/** ACTIONS */
export const addDiet = async (req: Request, res: Response) => {
  let dietHandler = new DietHandler(req.body);
  dietHandler = await refactorValuesForDb(dietHandler);
  dietHandler.save().then( id => res.redirect(`/nutrition/diet/${id}`) );
};

export const updateDiet = async (req: Request, res: Response) => {
  const dietId: string = req.params.dietId;
  let diet = new DietHandler(req.body);
  diet.id = dietId;
  diet = await refactorValuesForDb(diet);
  
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
    DietHandler.removeNameById(dietId);
    console.log(`'${deleteResponse.name}' diet deleted successfully.`);
    res.redirect(`/nutrition/diet/`);
  })
  .catch(err => {
    console.log('Error while deleting Diet: ', err);
  });
};

/*** FUNCTIONS */
const refactorValuesForDb = async (diet: DietHandler) => {
  diet.safeForConditions = await refactorChronicConditions(diet.safeForConditions);
  return diet;
};

const refactorChronicConditions = async (selectedConditions) => {
  if (!selectedConditions){ return null; }

  //Handles cases when the user only chooses one option and form returns a string
  if (typeof(selectedConditions) === 'string') {
    selectedConditions = [selectedConditions]; 
  }
  //Fetches all the chronic conditions to pair with their names
  const _conditionNames = await ChronicConditionHandler.getAllNames();

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