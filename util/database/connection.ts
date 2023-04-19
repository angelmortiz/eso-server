import mongoose from 'mongoose'; //using schemas and classes to interact with mongodb
import getVaultSecret from '../keyvault/azureKeyVaultConfig';
mongoose.set('strictQuery', true);

export const connectToDb = async () => {
  let dbString: string;

  //TODO: Add error handlinng for Key Vault
  //values were not passed through .env, use cloud vault values
  if (process.env.DATABASE_STRING && process.env.DATABASE_PASSWORD) {
    dbString = process.env.DATABASE_STRING?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!)!;
  } else {
    const [secretDbString, secretDbPassword] = await Promise.all([
      getVaultSecret('azure-mongodb-prod-connstring'),
      getVaultSecret('azure-mongodb-prod-password'),
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