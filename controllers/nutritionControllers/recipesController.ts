import { Request, Response } from 'express';
import RecipeHandler from '../../models/nutritionModels/recipeModel';

/** APIS */
export const apiDeleteRecipe = (req: Request, res: Response) => {
  const recipeId: string = req.params.recipeId;

  RecipeHandler.deleteById(recipeId)
  .then( deleteResponse => {
    //removes the recipe from recipes dropdown
    //removes the food from foods dropdown
    RecipeHandler.removeNameById(recipeId);
    console.log(`'${deleteResponse.name}' recipe deleted successfully.`);
    res.redirect(`/nutrition/recipe/`);
  })
  .catch(err => {
    console.log('Error while deleting Recipe: ', err);
  });
};