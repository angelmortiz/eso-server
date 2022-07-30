const express = require ('express'); //importing framework
const path = require('path');  //tool to create addresses
const rootDir = require('./util/path');// importing utility to create paths
const bodyParser = require('body-parser'); //parser to read info from client-side
const nutritionData = require('./routes/nutrition'); //routes for nutrition
const activitiesData = require('./routes/activities'); //routes for activities
const exp = express(); //initializing express framework

exp.set('view engine', 'ejs'); //activates ejs templates to create dynamic htmls
exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client
exp.use(express.static(path.join(rootDir, 'public'))); //uploads public files (css) to client
exp.use('/nutrition', nutritionData.routes); //executes routes for nutrition
exp.use('/activities', activitiesData.routes); //executes routes for activities

//Implement 404 logic
// exp.use('/*', (request, response, next) => {
//     response.render('./general/404', {
//         pageTitle: 'Page not found'
//       });
// });

exp.use('/', (request, response, next) => {
    response.render('./general/home', {
        pageTitle: 'Welcome to En Salud Optima application!'
      });
});

exp.listen(3000);