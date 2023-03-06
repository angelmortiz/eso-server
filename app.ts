import express, { NextFunction, Request, Response } from 'express'; //importing framework
import cors from 'cors';
import path from 'path';  //tool to create addresses
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import compression from 'compression';
import bodyParser from 'body-parser'; //parser to read info from client-side
import rootDir from './util/path';// importing utility to create paths
import AppError from './util/errors/appError';
import apisNutritionRouter from './routes/apisNutritionRouter';
import apisActivitiesRouter from './routes/apisActivitiesRouter';
import apisUserAuthRouter from './routes/apisUserAuthRouter';
import apisUserInfoRouter from './routes/apisUserInfoRouter';
import apisHomePageRouter from './routes/apisHomePageRouter';


import { protectRoute }  from './controllers/userControllers/userAuthController';
import { globalErrorResponse } from './controllers/responseControllers/errorController';
// import hpp from 'hpp';

const app = express(); //initializing express framework

/** UTIL MIDDLEWARES */
// Adds different layers of security and protection to the app
app.use(helmet()); 

//TODO: Implement development env logger

//Limits requests from the same IP (prevent brute force attacks)
const limiter = rateLimit({
    max: 100,
    windowMs: 10 * 60 * 1000,
    message: 'Too many requests made from this IP, please try again in one hour.'
})
app.use('/api', limiter); 

//Allows the app to read received json objects and limits the size (prevents attacks)
app.use(express.json({limit: '10kb'}));
//parses the body that comes from the client
app.use(bodyParser.urlencoded({extended: false})); 

app.use(cors({origin: [`http://${process.env.CLIENT_ADDRESS}:${process.env.CLIENT_PORT}`], credentials: true}));

//Data sanitization against NoSQL attacks
app.use(mongoSanitize());

//Prevents XSS attacks
app.use(xss());

//Prevents paramater pollution
//app.use(hpp());

//improves performance by compression the data output
app.use(compression());

//uploads public files (css) to client
app.use(express.static(path.join(rootDir, 'public'))); 

app.use('/api/auth', apisUserAuthRouter);
app.use('/api/users', protectRoute, apisUserInfoRouter);
app.use('/api/nutrition', protectRoute, apisNutritionRouter);
app.use('/api/activities', protectRoute, apisActivitiesRouter);
app.use('/api', apisHomePageRouter);
app.use('/', apisHomePageRouter);

//route not found
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`'${req.originalUrl}' is an invalid address on this server.`, 404));
});

//global error handling
app.use(globalErrorResponse);

export default app;