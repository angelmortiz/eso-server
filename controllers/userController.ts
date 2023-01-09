import { NextFunction, Request, Response } from "express";
import { IUser } from "../util/interfaces/userInterfaces";
import UserHandler from '../models/userModels/userAuthModel';

export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    const user: IUser = await UserHandler.fetchById(userId);
    if (!user) {
        res.status(404).json({
            status: 'failed',
            message: 'User not found.'
        });
        return;
    }

    res.status(200).json({
        status: 'success',
        message: 'User fetched successfully',
        userInfo: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            imageLink: user.imageLink
        }
    });
};