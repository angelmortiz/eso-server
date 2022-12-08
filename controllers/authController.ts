import { NextFunction, Request, Response } from 'express';
import UserHandler from '../models/userModels/userModel';
const jwt =  require('jsonwebtoken');

//TODO: Implement the catchAsync function to catch errors
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name 
        || !req.body.email 
        || !req.body.password 
        || !req.body.passwordConfirmation) {
            res.status(400).json({
                status: 'failed',
                message: 'One or more required fields missing.'
            });
            return;
        }
    
    if (req.body.password !== req.body.passwordConfirmation){
        res.status(400).json({
            status: 'failed',
            message: 'Password and password confirmation are not the same.'
        });
        return;
    }

    const userInfo = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        imageLink: req.body.imageLink
    }
    const userHandler = new UserHandler(userInfo); 
    const userId = await userHandler.save();

    const token = jwt.sign({id: userId},  )
    res.status(201).json({
        status: 'success',
        data: {
            newUser: {userId, ...userHandler}
        }
    });
}