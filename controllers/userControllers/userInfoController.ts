import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import UserAuthHandler from '../../models/userModels/userAuthModel';
import UserInfoHandler from '../../models/userModels/userInfoModel';
import AppError from '../../util/errors/appError';

export const apiGetUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.id;
    
    if (!res.locals?.user?.id) {
      return next(
        new AppError(`No user id found in 'res.locals.user'`, 404)
      );
    }

    const userInfo = await UserAuthHandler.fetchById(userId);

    if (!userInfo) {
      return next(
        new AppError(`No user info found using id '${userId}'.`, 404)
      );
    }

    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(userInfo));
  }
);

export const apiGetAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const userNames = await UserAuthHandler.fetchAllNames();

    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(userNames));
  }
);

export const apiGetUserInfoById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.userId;
    const userInfo = await UserInfoHandler.fetchById(userId);

    if (!userInfo) {
      return next(new AppError(`No user found using id '${userId}'.`, 404));
    }
    res.status(RESPONSE_CODE.OK).json(RESPONSE.FETCHED_SUCCESSFULLY(userInfo));
  }
);

export const apiAddUserInfo = catchAsync(
  async (req: Request, res: Response) => {
    //defaults to current user auth id if no id is provided as part of the request
    if (!req.body.userAuthId) {
      req.body.userAuthId = res.locals.user.id;
    }

    await UserInfoHandler.save(req.body);
    res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
  }
);

export const apiUpdateUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.userId;
    if (!userId) {
      return next(new AppError(`No userId found in the parameters.`, 404));
    }

    await UserInfoHandler.update(userId, req.body);
    res.status(RESPONSE_CODE.CREATED).json(RESPONSE.UPDATED_SUCCESSFULLY());
  }
);

export const apiDeleteUserInfo = catchAsync(
  async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    await UserInfoHandler.deleteById(userId);
    res.status(RESPONSE_CODE.ACCEPTED).json(RESPONSE.DELETED_SUCCESSFULLY());
  }
);
