import {Request, Response} from 'express';
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