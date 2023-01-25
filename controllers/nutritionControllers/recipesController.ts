import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import AppError from '../../util/errors/appError';
import RecipeHandler from '../../models/nutritionModels/recipeModel';

/** APIS */
export const apiGetRecipes = async (req: Request, res: Response) => {
  const muscles = await RecipeHandler.getAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscles));
};

export const apiGetRecipeNames = async (req: Request, res: Response) => {
  const muscleNames = await RecipeHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscleNames));
};

export const apiGetRecipeById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const muscleId: string = req.params.muscleId;
  const muscle = await RecipeHandler.fetchById(muscleId);

  if (!muscle) { return next(new AppError(`No muscle found using id '${muscleId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(muscle));
});

export const apiAddRecipe = async (req: Request, res: Response) => {
  let muscleHandler = new RecipeHandler(req.body);
  
  await muscleHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdateRecipe = catchAsync(async (req: Request, res: Response) => {
  let muscleHandler = new RecipeHandler(req.body);

  await muscleHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteRecipe = catchAsync(async (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;

  await RecipeHandler.deleteById(muscleId);
  //removes the muscle from muscles list (cached ids and names)
  RecipeHandler.removeNameById(muscleId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});