const mongoose = require('mongoose'); //using schemas and classes to interact with mongodb

exports.nutritionDb = mongoose.createConnection('mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/nutrition?retryWrites=true&w=majority')
  .on('connected', () => {
    console.log('Connected to nutritionn database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to nutrition db: ', error);
  });


exports.activitiesDb = mongoose.createConnection('mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/activities?retryWrites=true&w=majority')
  .on('connected', () => {
    console.log('Connected to activities database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to activities db: ', error);
  });