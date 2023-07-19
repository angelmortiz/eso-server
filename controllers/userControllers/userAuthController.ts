import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { IssueAuthJWT, IssueBetaUserJWT } from '../../util/auth/Jwt';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';
import util from 'util';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import crypto from 'crypto';
import sendEmail from '../../util/email';
import UserAuthHandler from '../../models/userModels/userAuthModel';
import AppError from '../../util/errors/appError';
// import getVaultSecret from '../../util/keys/awsKMSConfig';
import config from '../../config';
import {
  GetAuthCookieOptions,
  GetBetaUserCookieOptions,
  GetJWTFromCookies,
} from '../../util/auth/Cookie';
import BetaUserAuthHandler from '../../models/userModels/betaUserAuthModel';
import { IBetaUserAuth } from '../../util/interfaces/userInterfaces';

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
      strategy: 'Email',
      role: 'User',
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

    //FIXME: Consider moving beta logic to its own controller
    if (['beta', 'beta_local'].includes(config.env) && !user.betaUser) {
      await sendResponseWithBetaCookie(
        user._id.toString(),
        RESPONSE_CODE.OK,
        res,
        'User requires beta registration to proceed.'
      );
      return;
    }

    await sendResponseWithCookie(
      user._id.toString(),
      RESPONSE_CODE.OK,
      res,
      'User logged in successfully.'
    );
  }
);

export const loginWithGoogle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { scope: ['email', 'profile'] })(
      req,
      res,
      next
    );
  }
);

export const loginWithGoogleFailureRedirect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', (err, user) => {
      if (err) {
        //detects duplicate emails
        if (err.code === 11000 || err.code === 11001) {
          return next(
            new AppError(
              `An account with the email address '${err?.keyValue?.email}' already exists`,
              401
            )
          );
        }

        //default error
        return next(
          new AppError(`An error occurred during authentication`, 500)
        );
      } else if (!user) {
        return next(new AppError(`Failed to authenticate user`, 401));
      }

      res.locals.user = user;
      next();
    })(req, res, next);
  }
);

export const loginWithGoogleSuccessRedirect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Successful authentication, issue token.

    //FIXME: Consider moving beta logic to its own controller
    if (
      ['beta', 'beta_local'].includes(config.env) &&
      !res.locals.user.betaUser
    ) {
      const betaToken = IssueBetaUserJWT(res.locals.user._id);
      const betaCookieOptions = GetBetaUserCookieOptions();
      res.cookie('_betaAccessToken', betaToken, betaCookieOptions);
      console.log(config.betaUserRegistrationAddress);

      res.redirect(config.betaUserRegistrationAddress!);
      return;
    }

    const token = IssueAuthJWT(res.locals.user._id);
    const cookieOptions = GetAuthCookieOptions();

    res.cookie('_accessToken', token, cookieOptions);
    res.redirect(config.redirectClientUrl!);
  }
);

export const loginWithFacebook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook')(req, res, next);
  }
);

export const loginWithFacebookFailureRedirect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', (err, user) => {
      if (err) {
        //detects duplicate emails
        if (err.code === 11000 || err.code === 11001) {
          return next(
            new AppError(
              `An account with the email address '${err?.keyValue?.email}' already exists`,
              401
            )
          );
        }

        console.error(`Error details: ${JSON.stringify(err)}`);
        //default error
        return next(
          new AppError(`An error occurred during authentication`, 500)
        );
      } else if (!user) {
        return next(new AppError(`Failed to authenticate user`, 401));
      }

      res.locals.user = user;
      next();
    })(req, res, next);
  }
);

export const loginWithFacebookSuccessRedirect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Successful authentication, issue token.
    //FIXME: Consider moving beta logic to its own controller
    if (
      ['beta', 'beta_local'].includes(config.env) &&
      !res.locals.user.betaUser
    ) {
      const betaToken = IssueBetaUserJWT(res.locals.user._id);
      const betaCookieOptions = GetBetaUserCookieOptions();
      res.cookie('_betaAccessToken', betaToken, betaCookieOptions);
      console.log(config.betaUserRegistrationAddress);

      res.redirect(config.betaUserRegistrationAddress!);
      return;
    }

    const token = IssueAuthJWT(res.locals.user._id);
    const cookieOptions = GetAuthCookieOptions();

    res.cookie('_accessToken', token, cookieOptions);
    res.redirect(config.redirectClientUrl!);
  }
);

export const registerBetaUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    if (!code) {
      return next(new AppError(`Beta user code missing.`, 400));
    }

    const betaAuth: IBetaUserAuth | null =
      await BetaUserAuthHandler.fetchByCode(code);
    if (!betaAuth) {
      return next(new AppError(`Invalid beta code.`, 400));
    }

    const { cookie: cookies } = req.headers;
    const token = GetJWTFromCookies(cookies, '_betaAccessToken');
    if (!token) {
      return next(new AppError(`No beta token found.`, 401));
    }

    const jwtVerify = util.promisify(jwt.verify); //converts node.js callback function to promise
    const decodedJwt = await jwtVerify(
      token,
      process.env.JWT_BETA_SECRET //FIXME: Implement AWS|| (await getVaultSecret('jwt-secret'))
    );

    const currentUser = await UserAuthHandler.fetchById(decodedJwt.id);
    if (!currentUser) {
      return next(new AppError(`User not found.`, 404));
    }

    //FIXME: Check if there is a way to obtain the email from FB Auth
    betaAuth.strategy = currentUser.strategy;
    if (betaAuth.strategy == 'Email') {
      betaAuth.email = currentUser.email;
    } else if (betaAuth.strategy == 'Google') {
      betaAuth.email = currentUser.email;
      betaAuth.profileId = currentUser.profileId;
    } else if (betaAuth.strategy == 'Facebook') {
      betaAuth.profileId = currentUser.profileId;
    }

    currentUser.betaUser = true;
    await UserAuthHandler.update(currentUser._id!, currentUser);
    await BetaUserAuthHandler.update(betaAuth._id!, betaAuth);

    res.clearCookie('_betaAccessToken');

    await sendResponseWithCookie(
      currentUser._id.toString(),
      RESPONSE_CODE.OK,
      res,
      'User registered successfully.'
    );
  }
);

export const logout = (req: Request, res: Response) => {
  res.clearCookie('_accessToken');
  res.clearCookie('_betaAccessToken');
  res.status(RESPONSE_CODE.OK).json(RESPONSE.LOGGED_OUT_SUCCESSFULLY());
};

export const protectRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cookie: cookies } = req.headers;

    const token = GetJWTFromCookies(cookies, '_accessToken');

    if (!token) {
      return next(new AppError(`No authorization token found.`, 401));
    }

    const jwtVerify = util.promisify(jwt.verify); //converts node.js callback function to promise
    const decodedJwt = await jwtVerify(
      token,
      process.env.JWT_SECRET //FIXME: Implement AWS|| (await getVaultSecret('jwt-secret'))
    );

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

    const clientPort =
      process.env.NODE_ENV === 'production'
        ? ''
        : `:${process.env.CLIENT_PORT || '8080'}`;
    const resetURL = `${req.protocol}://${process.env.CLIENT_ADDRESS}${clientPort}/auth/resetPassword?token=${resetToken}`;
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

    await sendResponseWithCookie(
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

    await sendResponseWithCookie(
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

    const token = GetJWTFromCookies(cookies, '_accessToken');

    if (!token) {
      //console.log('No authorization token found.');
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
    const decodedJwt = await jwtVerify(
      token,
      process.env.JWT_SECRET //FIXME: Implement AWS|| (await getVaultSecret('jwt-secret'))
    );

    const currentUser = await UserAuthHandler.fetchById(decodedJwt.id);
    if (!currentUser) {
      res
        .status(RESPONSE_CODE.ACCEPTED)
        .json(RESPONSE.USER_AUTHENTICATION_RESPONSE(false, 'User deleted.'));
      return;
    }

    if (currentUser.hasChangedPasswordAfterJwtCreation(decodedJwt.iat)) {
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

const sendResponseWithCookie = async (
  userId: string,
  statusCode: RESPONSE_CODE,
  res: Response,
  message: string
) => {
  const token = IssueAuthJWT(userId);
  const cookieOptions = GetAuthCookieOptions();

  res.cookie('_accessToken', token, cookieOptions);
  res.status(statusCode).json(
    RESPONSE.responseObject(true, 'success', message, {
      user: userId
    })
  );
};

const sendResponseWithBetaCookie = async (
  userId: string,
  statusCode: RESPONSE_CODE,
  res: Response,
  message: string
) => {
  const betaToken = IssueBetaUserJWT(userId);
  const betaCookieOptions = GetBetaUserCookieOptions();
  res.cookie('_betaAccessToken', betaToken, betaCookieOptions);
  res.status(statusCode).json(
    RESPONSE.responseObject(true, 'success', message, {
      user: userId,
      requiresBetaRegistration: true,
    })
  );
};
