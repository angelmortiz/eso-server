const express = require ('express'); //importing framework
const path = require('path');  //tool to create addresses
const rootDir = require('./util/path');// importing utility to create paths
const bodyParser = require('body-parser'); //parser to read info from client-side
const nutritionRouter = require('./routes/nutritionRouter'); //routes for nutrition
const activitiesRouter = require('./routes/activitiesRouter'); //routes for activities
const homeController = require('./controllers/homeController'); //imports logic to load home page
const errorController = require('./controllers/errorsController'); //imports logic to load home page
const exp = express(); //initializing express framework
const mongooseConnections = require('./util/database').mongooseConnections; //importing connection for mongoose

exp.set('view engine', 'ejs'); //activates ejs templates to create dynamic htmls
exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client

exp.use(express.static(path.join(rootDir, 'public'))); //uploads public files (css) to client

//home
exp.get('/', homeController.getHome); 
//server side internal routes
exp.use('/nutrition', nutritionRouter.routes); //executes routes for nutrition
exp.use('/activities', activitiesRouter.routes); //executes routes for activities
//API external routes
exp.use('/api/nutrition', nutritionRouter.routes);
exp.use('/api/activities', activitiesRouter.routes);
//error handling
exp.use('/', errorController.get404); //navigates to 404 error if the address provided does not exist

//connects to the database and starts the server after it's connected
mongooseConnections(() => {
    exp.listen(3000); //specifying port #
});