import { ObjectID } from 'bson';
import { NextFunction, Request, Response } from 'express';
import UserHandler from '../models/userModels/userModel';
const util = require('util');
const jwt =  require('jsonwebtoken');

//TODO: Implement the catchAsync function to catch errors
export const signup = async (req: Request, res: Response) => {
    const {name, email, password, passwordConfirmation, imageLink} = req.body;

    if (!name || !email || !password || !passwordConfirmation) {
        res.status(400).json({
            status: 'failed',
            message: 'One or more required fields missing.'
        });
        return;
    }
    
    if (password !== passwordConfirmation){
        res.status(400).json({
            status: 'failed',
            message: 'Password and password confirmation are not the same.'
        });
        return;
    }

    const userInfo = {name, email, password, imageLink, passwordChangedAt: Date.now()}

    const userHandler = new UserHandler(userInfo); 
    const userId = await userHandler.save();

    const token = getToken(userId);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            newUser: {userId, name, email}
        }
    });
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        res.status(400).json({
            status: 'failed',
            message: 'One or more required fields are missing.'
        });
        return;
    }

    const user = await UserHandler.fetchByEmail(email);
    const isPasswordCorrect = await user.validatePassword(password);

    if (!user || !isPasswordCorrect) {
        res.status(401).json({
            status: 'failed',
            message: 'Incorrect email or password.'
        });
        return;
    }

    const token = getToken(user._id);
    res.status(200).json({
        status: 'success',
        message: 'User logged in successfully.',
        user: {
            userId: user._id
        },
        token
    });
}

export const protectRoute = async (req: Request | any, res: Response, next: NextFunction) => {
    const {  authorization  } = req.headers;
    
    if (!authorization) {
        //TODO: Implement a global error handler
        console.log('No authorization token found.');
        res.status(401).json({
            status: 'failed',
            message: 'No authorization token found.'
        })
        return;
    }

    if (!authorization.startsWith('Bearer')){
        //TODO: Implement a global error handler
        console.log('Incorrect format for the authorization token.');
        res.status(401).json({
            status: 'failed',
            message: 'Incorrect format for the authorization token.'
        })
        return;
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        //TODO: Implement a global error handler
        console.log('Incorrect format for the authorization token.');
        res.status(401).json({
            status: 'failed',
            message: 'Incorrect format for the authorization token.'
        })
        return;
    }

    const jwtVerify = util.promisify(jwt.verify); //converts node.js callback function to promise
    const decodedJwt = await jwtVerify(token, process.env.JWT_SECRET);

    const currentUser = await UserHandler.fetchById(decodedJwt.id);
    if (!currentUser) {
        //TODO: Implement a global error handler
        console.log('User deleted.');
        res.status(401).json({
            status: 'failed',
            message: 'User deleted.'
        })
        return;
    }

    if (currentUser.hasChangedPasswordAfterJwtCreation(decodedJwt.iat)){
         //TODO: Implement a global error handler
         console.log('Password changed after JWT creation.');
         res.status(401).json({
            status: 'failed',
            message: 'Password changed after JWT creation.'
        })
         return;
    }

    req.user = currentUser;
    next();
}


const getToken = (id: string | ObjectID) => {
    return jwt.sign({id},  process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}