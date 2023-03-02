import mongoose from 'mongoose'; //using schemas and classes to interact with mongodb

export const connectToDb = async () => {
  let dbString = process.env.DATABASE_STRING?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!)!;
  try {
    await mongoose.connect(dbString);
    console.log('Connected to database successfully.');
  } catch (error) {
    console.log('Error connecting to database: ', error);
  }
}