import { NextFunction, Request, Response} from "express"

export const catchAsync = fn => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};