import { Request, Response } from 'express';
import FoodHandler from '../../models/nutritionModels/foodModel';

/** APIS */
export const apiGetFoods = async (req: Request, res: Response) => {
  res.json(await FoodHandler.getAllNames());
};

export const apiDeleteFood = async (req: Request, res: Response) => {
  const foodId: string = req.params.foodId;

  FoodHandler.deleteById(foodId)
  .then( deleteResponse => {
    //removes the food from foods dropdown
    FoodHandler.removeNameById(foodId);
    console.log(`'${deleteResponse.name}' food deleted successfully.`);
    res.redirect(`/nutrition/food/`);
  })
  .catch(err => {
    console.log('Error while deleting Food: ', err);
  });
};