import { ObjectID } from 'bson';
import { NextFunction, Request, Response } from 'express';
import { CookieOptions } from '../../util/types/types';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import util from 'util';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../../util/email';
import UserAuthHandler from '../../models/userModels/userAuthModel';
import AppError from '../../util/errors/appError';

//TODO: Send confirmation email to check the email provided is valid
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
      imageLink,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !passwordConfirmation
    ) {
      return next(new AppError(`One or more required fields missing.`, 400));
    }

    if (password !== passwordConfirmation) {
      return next(
        new AppError(
          `Password and password confirmation are not the same.`,
          400
        )
      );
    }

    const fullName = firstName.concat(' ', lastName);
    const userInfo = {
      firstName,
      lastName,
      fullName,
      email,
      password,
      imageLink,
      passwordChangedAt: new Date(),
      role: 'User'
    };

    await UserAuthHandler.save(userInfo);

    res.status(RESPONSE_CODE.CREATED).json(RESPONSE.ADDED_SUCCESSFULLY());
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(`One or more required fields missing.`, 400));
    }

    const user = await UserAuthHandler.fetchByEmail(email);
    const isPasswordCorrect = await user?.validatePassword(password);

    if (!user || !isPasswordCorrect) {
      return next(new AppError(`Incorrect email or password.`, 401));
    }

    sendResponseWithCookie(
      user._id.toString(),
      RESPONSE_CODE.OK,
      res,
      'User logged in successfully.'
    );
  }
);

export const logout = (req: Request, res: Response) => {
  res.clearCookie('_accessToken');
  res.status(RESPONSE_CODE.OK).json(RESPONSE.LOGGED_OUT_SUCCESSFULLY());
};

export const protectRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cookie: cookies } = req.headers;

    const token = getTokenFromCookies(cookies);

    if (!token) {
      return next(new AppError(`No authorization token found.`, 401));
    }

    const jwtVerify = util.promisify(jwt.verify); //converts node.js callback function to promise
    const decodedJwt = await jwtVerify(token, process.env.JWT_SECRET);

    const currentUser = await UserAuthHandler.fetchById(decodedJwt.id);
    if (!currentUser) {
      return next(new AppError(`User not found.`, 404));
    }

    if (currentUser.hasChangedPasswordAfterJwtCreation(decodedJwt.iat)) {
      return next(new AppError('Password changed after JWT creation.', 401));
    }

    res.locals.user = currentUser;
    next();
  }
);

export const restrictAccessTo = (...roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.user?.role)) {
      return next(
        new AppError(
          'Current user does not have permission for this action.',
          403
        )
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(
        new AppError('An email must be provided to reset password.', 400)
      );
    }

    const user = await UserAuthHandler.fetchByEmail(email);
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    const resetToken = user.createResetToken();
    await user.save(); //saves resetToken and expiresAt after setting the values in schema.

    const resetURL = `${req.protocol}://${process.env.CLIENT_ADDRESS}:${process.env.CLIENT_PORT}/auth/resetPassword?token=${resetToken}`;
    const message = `Forgot your password? Submit a request with your new password and confirmation password.\nUse the following url: ${resetURL}\nIf this wasn't you, please ignore this email.`;

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

      return next(
        new AppError(`Email count not be sent. Error: ${error}`, 404)
      );
    }

    res.status(RESPONSE_CODE.OK).json(RESPONSE.TOKEN_SENT_SUCCESSFULLY());
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordConfirmation, resetToken } = req.body;

    if (!password || !passwordConfirmation || !resetToken) {
      return next(
        new AppError('Missing required values to reset password.', 400)
      );
    }

    if (password !== passwordConfirmation) {
      return next(new AppError('Passwords do not match.', 400));
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const user = await UserAuthHandler.fetchByResetToken(hashedToken);

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    if (
      user.passwordResetExpiresAt &&
      user.passwordResetExpiresAt?.getTime() < Date.now()
    ) {
      return next(new AppError('Reset token has expired.', 404));
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    sendResponseWithCookie(
      user?.id,
      RESPONSE_CODE.OK,
      res,
      'Password reset successfully.'
    );
  }
);

export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirmation } = req.body;
    const userId = res.locals.user.id;

    if (newPassword !== passwordConfirmation) {
      return next(new AppError('Passwords do not match.', 400));
    }

    const user = await UserAuthHandler.fetchById(userId);
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    const isPasswordCorrect = await user.validatePassword(currentPassword);
    if (!isPasswordCorrect) {
      return next(new AppError('Incorrect password.', 401));
    }

    user.password = newPassword;
    await user.save();

    sendResponseWithCookie(
      user._id,
      RESPONSE_CODE.ACCEPTED,
      res,
      'User password changed successfully.'
    );
  }
);

export const isAuthenticationValid = catchAsync(
  async (req: Request, res: Response) => {
    const { cookie: cookies } = req.headers;

    const token = getTokenFromCookies(cookies);

    if (!token) {
      console.log('No authorization token found.');
      res
        .status(RESPONSE_CODE.ACCEPTED)
        .json(
          RESPONSE.USER_AUTHENTICATION_RESPONSE(
            false,
            'No authorization token found.'
          )
        );
      return;
    }

    const jwtVerify = util.promisify(jwt.verify); //converts node.js callback function to promise
    const decodedJwt = await jwtVerify(token, process.env.JWT_SECRET);

    const currentUser = await UserAuthHandler.fetchById(decodedJwt.id);
    if (!currentUser) {
      console.log('User deleted.');
      res
        .status(RESPONSE_CODE.ACCEPTED)
        .json(RESPONSE.USER_AUTHENTICATION_RESPONSE(false, 'User deleted.'));
      return;
    }

    if (currentUser.hasChangedPasswordAfterJwtCreation(decodedJwt.iat)) {
      console.log('Password changed after JWT creation.');
      res
        .status(RESPONSE_CODE.ACCEPTED)
        .json(
          RESPONSE.USER_AUTHENTICATION_RESPONSE(
            false,
            'Password changed after JWT creation.'
          )
        );
      return;
    }

    res
      .status(RESPONSE_CODE.OK)
      .json(
        RESPONSE.USER_AUTHENTICATION_RESPONSE(
          true,
          'User authenticated successfully.'
        )
      );
  }
);

const getTokenFromCookies = (cookies: string | undefined) => {
  //getting authentication token from cookies
  let token: string | undefined;
  const arrCookies = cookies?.split('; ') || [];
  token =
    arrCookies.length > 1
      ? arrCookies.find((c) => c.startsWith('_accessToken='))
      : arrCookies[0];
  token = token?.split('=')[1];
  return token;
};

const getToken = (id: string | ObjectID) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendResponseWithCookie = (
  userId: string,
  statusCode: RESPONSE_CODE,
  res: Response,
  message: string
) => {
  const token = getToken(userId);
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('_accessToken', token, cookieOptions);
  res
    .status(statusCode)
    .json(RESPONSE.responseObject(true, 'success', message, { user: userId }));
};
