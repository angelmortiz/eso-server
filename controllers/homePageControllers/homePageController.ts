import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../util/errors/catchAsync';
import { RESPONSE_CODE } from '../responseControllers/responseCodes';
import * as RESPONSE from '../responseControllers/responseCodes';

export const apiGetHomePage = catchAsync(
  async (req: Request, res: Response) => {
    res.send(
      '<html> <head>Server Response</head><body><h1>Welcome to En Salud Optima</h1></body></html>'
    );
  }
);
