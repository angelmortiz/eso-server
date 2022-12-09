import express from 'express'; //importing framework
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

const exp = express(); //initializing express framework
exp.use(express.json())
exp.use(cors({origin: ['http://localhost:3001', 'http://192.168.4.173:3001', 'http://192.168.4.129:3001']}));

exp.set('view engine', 'ejs'); //activates ejs templates to create dynamic htmls
exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client

exp.use(express.static(path.join(rootDir, 'public'))); //uploads public files (css) to client

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