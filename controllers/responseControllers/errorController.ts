import { NextFunction, Request, Response } from 'express';
import type { ErrorRequestHandler } from 'express';
import { responseObject } from './responseCodes';

//Provides more information about the error on dev mode
const devError = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    ...responseObject(false, err.status || 'error', err.message),
    errorDescription: err,
    errorStack: err.stack,
  });
};

const prodError = (err: any, res: Response) => {
  //Deals with programming or unknown server errors
  if (!err.isOperational) {
    //logs error
    //IMPROVE: Use a log file instead of logging to the console
    console.error('An unrecognized error occurred: ', err);

    //returns error
    res
      .status(500)
      .json(
        responseObject(
          false,
          'error',
          'An unrecognized error occurred during execution.'
        )
      );
    return;
  }

  //Operational errors
  res
    .status(err.statusCode || 500)
    .json(responseObject(false, err.status || 'error', err.message));
};

export const globalErrorResponse: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      devError(err, res);
      break;
    default:
      prodError(err, res);
      break;
  }
};
