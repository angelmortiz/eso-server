const express = require ('express'); //importing framework
const path = require('path');  //tool to create addresses
const rootDir = require('./util/path');// importing utility to create paths
const bodyParser = require('body-parser'); //parser to read info from client-side
const nutritionRoutes = require('./routes/nutrition'); //routes for nutrition
const activitiesRoutes = require('./routes/activities'); //routes for activities
const homeController = require('./controllers/home'); //imports logic to load home page
const exp = express(); //initializing express framework

exp.set('view engine', 'ejs'); //activates ejs templates to create dynamic htmls
exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client

exp.use(express.static(path.join(rootDir, 'public'))); //uploads public files (css) to client

exp.use('/nutrition', nutritionRoutes.routes); //executes routes for nutrition
exp.use('/activities', activitiesRoutes.routes); //executes routes for activities

//Implement 404 logic
// exp.use('/*', (request, response, next) => {
//     response.render('./404', {
//         pageTitle: 'Page not found'
//       });
// });

//redirects all not found pages to home page
exp.use('/', homeController.getHome);

exp.listen(3000);