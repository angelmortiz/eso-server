const path = require('path');
const express = require ('express');
const exp = express();
const bodyParser = require('body-parser');
const nutritionRoutes = require('./routes/nutrition');
const activitiesRoutes = require('./routes/activities');

exp.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client

exp.use('/nutrition', nutritionRoutes);
exp.use('/activities', activitiesRoutes);

exp.use('/', (request, response, next) => {
    response.status(404).sendFile(path.join(__dirname, 'views', 'general', '404.html'))
});

exp.listen(3000);