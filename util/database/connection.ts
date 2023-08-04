import mongoose from 'mongoose'; //using schemas and classes to interact with mongodb
// import getVaultSecret from '../keys/awsKMSConfig';
mongoose.set('strictQuery', true);

export const connectToDb = async () => {
  let dbString: string;

  //TODO: Change logic to AWS KMS
  //values were not passed through .env, use cloud vault values
  dbString = process.env.DATABASE_STRING?.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD!
  )!?.replace('<DBENV>', process.env.DATABASE_ENV || 'env')!;

  //FIXME: Rewrite logic for AWS
  // if (process.env.DATABASE_STRING && process.env.DATABASE_PASSWORD) {
  // } else {

  //   dbString = secretDbString?.replace('<PASSWORD>', secretDbPassword!)!;
  // }

  try {
    await mongoose.connect(dbString);
    console.log(
      `Connected to MongoDB Atlas successfully. DB Env: '${process.env.DATABASE_ENV}'.`
    );
  } catch (error) {
    console.log('Error connecting to database: ', error);
  }
};
