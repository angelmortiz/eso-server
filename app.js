const path = require('path');
const rootDir = require('./util/path');
const express = require ('express');
const exp = express();
const bodyParser = require('body-parser');
const nutritionRoutes = require('./routes/nutrition');
const activitiesRoutes = require('./routes/activities');
const { appendFile } = require('fs');

exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client
exp.use(express.static(path.join(rootDir, 'public')));

exp.use('/nutrition', nutritionRoutes);
exp.use('/activities', activitiesRoutes);

//Implement 404 logic
// exp.use('/*', (request, response, next) => {
//     response.status(404).sendFile(path.join(__dirname, 'views', 'general', '404.html'));
// });

exp.use('/', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'general', 'home.html'));
});

exp.listen(3000);