import express from 'express'; //importing framework
import cors from 'cors';
import path from 'path';  //tool to create addresses
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import bodyParser from 'body-parser'; //parser to read info from client-side
import rootDir from './util/path';// importing utility to create paths
import apisNutritionRouter from './routes/apisNutritionRouter';
import apisActivitiesRouter from './routes/apisActivitiesRouter';
import apisAuthRouter from './routes/apisAuthRouter';
import apisUserRouter from './routes/apisUserRouter';

import { protectRoute, restrictAccessTo }  from './controllers/authController';
// import hpp from 'hpp';

const exp = express(); //initializing express framework

/** UTIL MIDDLEWARES */
// Adds different layers of security and protection to the app
exp.use(helmet()); 

//TODO: Implement development env logger

//Limits requests from the same IP (prevent brute force attacks)
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests made from this IP, please try again in one hour.'
})
exp.use('/api', limiter); 

//Allows the app to read received json objects and limits the size (prevents attacks)
exp.use(express.json({limit: '10kb'}));
//parses the body that comes from the client
exp.use(bodyParser.urlencoded({extended: false})); 

exp.use(cors({origin: ['http://localhost:3001', 'http://192.168.4.173:3001', 'http://192.168.4.129:3001'], credentials: true}));

//Data sanitization against NoSQL attacks
exp.use(mongoSanitize());

//Prevents XSS attacks
exp.use(xss());

//Prevents paramater pollution
//exp.use(hpp());

//uploads public files (css) to client
exp.use(express.static(path.join(rootDir, 'public'))); 

exp.use('/api/auth', apisAuthRouter);
exp.use('/api/user', protectRoute, apisUserRouter);
exp.use('/api/nutrition', protectRoute, apisNutritionRouter);
exp.use('/api/activities', protectRoute, apisActivitiesRouter);

export default exp;