import express, { application } from 'express'; //importing framework
import cors from 'cors';
import path from 'path';  //tool to create addresses
import rootDir from './util/path';// importing utility to create paths
import bodyParser from 'body-parser'; //parser to read info from client-side
import nutritionRouter from './routes/nutritionRouter'; //routes for nutrition
import apisNutritionRouter from './routes/apisNutritionRouter';
import activitiesRouter from './routes/activitiesRouter'; //routes for activities
import apisActivitiesRouter from './routes/apisActivitiesRouter';
import apisAuthRouter from './routes/apisAuthRouter';
import * as homeController from './controllers/homeController'; //imports logic to load home page
import * as errorController from './controllers/errorsController'; //imports logic to load home page
const authController = require('./controllers/authController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const hpp = require('hpp');

const exp = express(); //initializing express framework

/** UTIL MIDDLEWARES */
//Adds different layers of security and protection to the app
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


exp.use(cors({origin: ['http://localhost:3001', 'http://192.168.4.173:3001', 'http://192.168.4.129:3001']}));

//DELETE: Clean up the ejs files
exp.set('view engine', 'ejs'); //activates ejs templates to create dynamic htmls

//Data sanitization against NoSQL attacks
exp.use(mongoSanitize());

//Prevents XSS attacks
exp.use(xss());

//Prevents paramater pollution
//exp.use(hpp());

//uploads public files (css) to client
exp.use(express.static(path.join(rootDir, 'public'))); 


//home
exp.get('/', homeController.getHome); 
//registration
exp.use('/api/auth', apisAuthRouter);
//server side internal routes
exp.use('/nutrition', nutritionRouter); //executes routes for nutrition
exp.use('/activities', activitiesRouter); //executes routes for activities
//API external routes
exp.use('/api/nutrition', apisNutritionRouter);
exp.use('/api/activities', apisActivitiesRouter);
//error handling
exp.use('/', errorController.get404); //navigates to 404 error if the address provided does not exist

module.exports = exp;