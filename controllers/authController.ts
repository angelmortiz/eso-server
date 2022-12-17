import util from 'util';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../util/email';
import UserHandler from '../models/userModels/userModel';
import { ObjectID } from 'bson';
import { NextFunction, Request, Response } from 'express';
import { CookieOptions } from '../util/types/types';

//TODO: Implement the catchAsync function to catch errors
export const signup = async (req: Request, res: Response) => {
    const {firstName, lastName, email, password, passwordConfirmation, imageLink} = req.body;

    if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
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

    const userInfo = {firstName, lastName, email, password, imageLink, passwordChangedAt: Date.now()}

    const userHandler = new UserHandler(userInfo); 
    const userId = await userHandler.save();
    const user = await UserHandler.fetchById(userId);

    sendResponse(user._id, 201, res, 'User signed up successfully');
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
    const isPasswordCorrect = await user?.validatePassword(password);

    if (!user || !isPasswordCorrect) {
        res.status(401).json({
            status: 'failed',
            message: 'Incorrect email or password.'
        });
        return;
    }

    sendResponse(user._id, 200, res, 'User logged in successfully.');
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    const {  cookie: cookies  } = req.headers;
    
    //getting authentication token from cookies
    let token: string | undefined;
    const arrCookies = cookies?.split('; ') || [];
    token = arrCookies.length > 1 ? arrCookies.find(c => c.startsWith('jwt=')) : arrCookies[0];
    token = token?.split('=')[1];

    if (!token) {
        //TODO: Implement a global error handler
        console.log('No authorization token found.');
        res.status(401).json({
            status: 'failed',
            message: 'No authorization token found.'
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

    res.locals.user = currentUser;
    next();
}

export const restrictAccessTo = (...roles) => {
 return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.user?.role)) {
        //TODO: Implement a global error handler
        console.log('Current user does not have permission for this action.');
        res.status(403).json({
           status: 'failed',
           message: 'Current user does not have permission for this action.'
       })
       return;
    }

    next();
 }
}
    
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        //TODO: Implement a global error handler
        console.log('An email must be provided to reset password.');
        res.status(400).json({
        status: 'failed',
        message: 'An email must be provided to reset password.'
        })
        return;
    }

    const user = await UserHandler.fetchByEmail(email);
    if (!user) {
        //TODO: Implement a global error handler
        console.log('User not found.');
        res.status(404).json({
        status: 'failed',
        message: 'User not found.'
        })
        return;
    }
    
    const resetToken = user.createResetToken();
    await user.save(); //saves resetToken and expiresAt after setting the values in schema.
    
    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a request with your new password and confirmation password.\nUse the following url: '${resetURL}'\nIf this wasn't you, please ignore this email.`

    try {
        await sendEmail({ 
            email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message,
        });
    } catch (error) {
        //clears out temp values if the email could not be sent
        user.passwordResetToken = undefined;
        user.passwordResetExpiresAt = undefined;
        await user.save();

        //TODO: Implement a global error handler
        console.log('Email count not be sent. Error: ', error);
        res.status(404).json({
        status: 'failed',
        message: `Email count not be sent. Error: ${error}`
        })
        return;
    }

    res.status(200).json({
        status: 'success',
        message: 'Reset token sent to email successfully.'
    });
}

export const resetPassword = async (req: Request, res: Response, NextFunction) => {
    const { resetToken } = req.params;
    const { password, passwordConfirmation } = req.body;

    if (password !== passwordConfirmation) {
        //TODO: Implement a global error handler
        console.log('Passwords do not match.');
        res.status(400).json({
        status: 'failed',
        message: `Passwords do not match.`
        })
        return;
    }

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await UserHandler.fetchByResetToken(hashedToken);

    if (!user) {
        //TODO: Implement a global error handler
        console.log('User not found.');
        res.status(404).json({
        status: 'failed',
        message: `User not found.`
        })
        return;
    }

    if (user.passwordResetExpiresAt < Date.now()){
        //TODO: Implement a global error handler
        console.log('Reset token has expired.');
        res.status(400).json({
        status: 'failed',
        message: `Reset token has expired.`
        })
        return;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    sendResponse(user._id, 200, res, 'Password reset successfully.');
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirmation } = req.body;
    const userId = res.locals.user.id;
    
    //IMPROVE: consider creating a middleware for the schema to make this verification automatically
    if (newPassword !== passwordConfirmation) {
        //TODO: Implement a global error handler
        console.log('Passwords do not match.');
        res.status(400).json({
        status: 'failed',
        message: `Passwords do not match.`
        })
        return;
    }

    const user = await UserHandler.fetchById(userId);
    if (!user) {
        res.status(404).json({
            status: 'failed',
            message: 'User not found.'
        });
        return;
    }

    const isPasswordCorrect = await user.validatePassword(currentPassword);
    if (!isPasswordCorrect) {
        res.status(401).json({
            status: 'failed',
            message: 'Incorrect password.'
        });
        return;
    }

    user.password = newPassword;
    await user.save();

    sendResponse(user._id, 201, res, 'User password changed successfully.');
}

const getToken = (id: string | ObjectID) => {
    return jwt.sign({id},  process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const sendResponse = (userId: string, statusCode: number, res: Response, message: string) => {
    const token = getToken(userId);
    const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000)),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        message,
        user: {
            userId
        },
        token
    });
}