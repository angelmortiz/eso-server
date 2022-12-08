import mongoose from 'mongoose'; //using schemas and classes to interact with mongodb

//TODO: Find a better way to unify all collections into one connection string
export const nutritionDb = mongoose.createConnection('mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/nutrition?retryWrites=true&w=majority')
  .on('connected', () => {
    console.log('Connected to nutritionn database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to nutrition db: ', error);
  });

export const activitiesDb = mongoose.createConnection('mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/activities?retryWrites=true&w=majority')
  .on('connected', () => {
    console.log('Connected to activities database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to activities db: ', error);
  });

export const usersDb = mongoose.createConnection('mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/users?retryWrites=true&w=majority')
  .on('connected', () => {
    console.log('Connected to users database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to users db: ', error);
  });