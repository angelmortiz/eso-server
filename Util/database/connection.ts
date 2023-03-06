import mongoose from 'mongoose'; //using schemas and classes to interact with mongodb
import getVaultSecret from '../keyvault/azureKeyVaultConfig';
mongoose.set('strictQuery', true);

export const connectToDb = async () => {
  let dbString: string;

  //values were not passed through .env, use cloud vault values
  if (process.env.DATABASE_STRING && process.env.DATABASE_PASSWORD) {
    dbString = process.env.DATABASE_STRING?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!)!;
  } else {
    const [secretDbString, secretDbPassword] = await Promise.all([
      getVaultSecret('mongodb-connectionstring'),
      getVaultSecret('mongodb-password'),
    ]);

    dbString = secretDbString?.replace('<PASSWORD>', secretDbPassword!)!;
  }

  try {
    await mongoose.connect(dbString);
    console.log('Connected to database successfully.');
  } catch (error) {
    console.log('Error connecting to database: ', error);
  }
};
