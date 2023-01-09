import { connectToDb } from './util/database/connection';
import dotenv from 'dotenv';
import app from './app';
dotenv.config();

//starts the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  connectToDb();
});