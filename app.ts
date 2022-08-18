import express from 'express'; //importing framework
import path from 'path';  //tool to create addresses
import rootDir from './util/path';// importing utility to create paths
import bodyParser from 'body-parser'; //parser to read info from client-side
import nutritionRouter from './routes/nutritionRouter'; //routes for nutrition
import activitiesRouter from './routes/activitiesRouter'; //routes for activities
import homeController from './controllers/homeController'; //imports logic to load home page
import errorController from './controllers/errorsController'; //imports logic to load home page

const exp = express(); //initializing express framework

exp.set('view engine', 'ejs'); //activates ejs templates to create dynamic htmls
exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client

exp.use(express.static(path.join(rootDir, 'public'))); //uploads public files (css) to client

//home
exp.get('/', homeController.getHome); 
//server side internal routes
exp.use('/nutrition', nutritionRouter); //executes routes for nutrition
exp.use('/activities', activitiesRouter); //executes routes for activities
//API external routes
exp.use('/api/nutrition', nutritionRouter);
exp.use('/api/activities', activitiesRouter);
//error handling
exp.use('/', errorController.get404); //navigates to 404 error if the address provided does not exist

//starts the server
exp.listen(3000); //specifying port #