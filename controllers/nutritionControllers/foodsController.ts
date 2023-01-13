import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import AppError from '../../util/errors/appError';
import FoodHandler from '../../models/nutritionModels/foodModel';

/** APIS */
export const apiGetFoods = async (req: Request, res: Response) => {
  const foods = await FoodHandler.getAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(foods));
};

export const apiGetFoodNames = async (req: Request, res: Response) => {
  const foodNames = await FoodHandler.fetchAllNames();
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(foodNames));
};

export const apiGetFoodById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const foodId: string = req.params.foodId;
  const food = await FoodHandler.fetchById(foodId);

  if (!food) { return next(new AppError(`No food found using id '${foodId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(food));
});

export const apiAddFood = async (req: Request, res: Response) => {
  let foodHandler = new FoodHandler(req.body);
  
  await foodHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
};

export const apiUpdateFood = catchAsync(async (req: Request, res: Response) => {
  let foodHandler = new FoodHandler(req.body);

  await foodHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteFood = catchAsync(async (req: Request, res: Response) => {
  const foodId: string = req.params.foodId;

  await FoodHandler.deleteById(foodId);
  //removes the food from foods list (cached ids and names)
  FoodHandler.removeNameById(foodId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});