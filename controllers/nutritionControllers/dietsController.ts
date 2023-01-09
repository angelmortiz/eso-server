import {Request, Response} from 'express';
import { ObjectId } from 'mongodb';
import { ConditionIdAndName } from '../../util/types/types';
import ChronicConditionHandler from '../../models/nutritionModels/chronicConditionModel';
import DietHandler from '../../models/nutritionModels/dietModel';

/** APIS */
export const apiGetDiets = async (req: Request, res: Response) => {
  res.json(await DietHandler.getAllNames());
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
        conditionName: _conditionNames.find(
          c => c._id.toString() === conditionId.toString())?.name || 'Nombre no disponible'
      };

      refactoredConditions.push(conditionObject);
    });
  
  return refactoredConditions;
};