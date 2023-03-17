import { NextFunction, Request, Response} from "express"

//Catches errors from async functions/handlers.
//Sends the errors to the global error handler middleware in app.ts.
//If no error occurres in fn, 'next()' won't be called and execution won't continue to error middleware
export const catchAsync = fn => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};