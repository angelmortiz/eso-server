import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../util/errors/catchAsync';
import { RESPONSE_CODE } from './responseControllers/responseCodes';
import * as RESPONSE from './responseControllers/responseCodes';
import UserHandler from '../models/userModels/userAuthModel';
import AppError from '../util/errors/appError';

export const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.id;

    const user = await UserHandler.fetchById(userId);
    if (!user) {
      return next(new AppError(`No user found using id '${userId}'.`, 404));
    }
    
    const userInfo = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      imageLink: user.imageLink,
    };

    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(userInfo));
  }
);
