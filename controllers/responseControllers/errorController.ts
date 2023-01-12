import { NextFunction, Request, Response } from "express";
import type { ErrorRequestHandler } from "express";
import { responseObject } from "./responseCodes";

export const globalErrorResponse: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json(responseObject(false, err.status || 'error', err.message));
}