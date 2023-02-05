import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import UserAuthHandler from '../../models/userModels/userAuthModel';
import AppError from '../../util/errors/appError';
import UserInfoHandler from '../../models/userModels/userInfoModel';

export const apiGetUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.id;

    const userAuth = await UserAuthHandler.fetchById(userId);
    if (!userAuth) {
      return next(new AppError(`No user auth found using id '${userId}'.`, 404));
    }
    
    const userInfo = await UserInfoHandler.fetchByUserAuthId(userId);

    const userInfoVals = {
      id: userAuth._id,
      firstName: userAuth.firstName,
      lastName: userAuth.lastName,
      email: userAuth.email,
      role: userAuth.role,
      imageLink: userAuth.imageLink,
      basicInfo: userInfo?.basicInfo,
      mainGoal: userInfo?.mainGoal
    };

    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(userInfoVals));
  }
);

export const apiGetUserInfoById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = req.params.userId;
  const userInfo = await UserInfoHandler.fetchById(userId);

  if (!userInfo) { return next(new AppError(`No user found using id '${userId}'.`, 404)); }
  res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(userInfo));
});

export const apiAddUserInfo = catchAsync(async (req: Request, res: Response) => {
  //defaults to current user auth id if no id is provided as part of the request
  if (!req.body.userAuthId) {
    req.body.userAuthId= res.locals.user.id
  } 
  let userInfoHandler = new UserInfoHandler(req.body);
  
  await userInfoHandler.save();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
});

export const apiUpdateUserInfo = catchAsync(async (req: Request, res: Response) => {
  let userInfoHandler = new UserInfoHandler(req.body);
  
  await userInfoHandler.update();
  res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
});

export const apiDeleteUserInfo = catchAsync(async (req: Request, res: Response) => {
  const userId: string = req.params.userId;

  await UserInfoHandler.deleteById(userId);
  res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
});