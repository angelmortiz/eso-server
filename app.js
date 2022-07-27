const express = require ('express');
const exp = express();
const bodyParser = require('body-parser');
const nutritionRoutes = require('./routes/nutrition');
const activitiesRoutes = require('./routes/activities');

exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client

exp.use(nutritionRoutes);
exp.use(activitiesRoutes);

exp.use('/', (request, response, next) => {
    console.log('Running default middleware!');
});

exp.listen(3000);