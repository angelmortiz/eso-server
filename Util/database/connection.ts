import mongoose from 'mongoose'; //using schemas and classes to interact with mongodb
import dotenv from 'dotenv';
dotenv.config();

let dbString = process.env.DATABASE_STRING?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);
//TODO: Find a better way to unify all collections into one connection string (using one db)
export const nutritionDb = mongoose.createConnection(dbString?.replace('<DBNAME>', 'nutrition') || '')
  .on('connected', () => {
    console.log('Connected to nutritionn database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to nutrition db: ', error);
  });

export const activitiesDb = mongoose.createConnection(dbString?.replace('<DBNAME>', 'activities') || '')
  .on('connected', () => {
    console.log('Connected to activities database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to activities db: ', error);
  });

export const usersDb = mongoose.createConnection(dbString?.replace('<DBNAME>', 'users') || '')
  .on('connected', () => {
    console.log('Connected to users database.');
  })
  .on('error', (error) => {
    console.log('Error connecting to users db: ', error);
  });