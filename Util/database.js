
const mongoose = require('mongoose'); //using schemas and classes to interact with mongodb

let _dbs;
const mongooseConnections = (callback) => {
  try {
    _dbs = {
      _nutritionDb: mongoose.createConnection('mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/nutrition?retryWrites=true&w=majority'),
      _activitiesDb: mongoose.createConnection('mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/activities?retryWrites=true&w=majority')
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
  console.log('Connected to databases.');
  callback();
}

// const mongooseConnection = (callback) => {
//   mongoose.connect(
//     // FIXME: Pull the user and password from a safe location instead of having them hardcoded
//     'mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/?retryWrites=true&w=majority'
//   )
//     .then((client) => {
//       console.log(mongoose.connection.useDb('nutrition'));
//       //creating an object with connections to multiple databases
//       // _dbs = {
//       //   nutritionDb: client.db('nutrition'),
//       //   activitiesDb: client.db('activities'),
//       // };
//       console.log('Connected to databases.');
//       callback();
//     })
//     .catch((error) => {
    
//       console.log(error);
//       throw error;
//     });
// };


/***********
 * 
 * 
 */

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _dbs;

// const mongodbConnection = (callback) => {
//   MongoClient.connect(
//     // FIXME: Pull the user and password from a safe location instead of having them hardcoded
//     'mongodb+srv://esoserver:MDBServerEso22@ensaludoptima.9c8id.mongodb.net/?retryWrites=true&w=majority'
//   )
//     .then((client) => {
//       //creating an object with connections to multiple databases
//       _dbs = {
//         nutritionDb: client.db('nutrition'),
//         activitiesDb: client.db('activities'),
//       };
//       console.log('Connected to databases.');
//       callback();
//     })
//     .catch((error) => {
    
//       console.log(error);
//       throw error;
//     });
// };

const getDbs = () => {
  if (_dbs) {
    return _dbs;
  }
  throw 'No database found';
};

const getNutritionDb = () => {
  if (_dbs && _dbs.nutritionDb) {
    return _dbs.nutritionDb;
  }
  throw 'No database found';
};

const getActivitiesDb = () => {
  if (_dbs && _dbs.activitiesDb) {
    return _dbs.activitiesDb;
  }
  throw 'No database found';
};

exports.mongooseConnections = mongooseConnections;
exports.getDbs = getDbs;
exports.getNutritionDb = getNutritionDb;
exports.getActivitiesDb = getActivitiesDb;