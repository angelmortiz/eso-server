import { connectToDb } from './util/database/connection';
import dotenv from 'dotenv';
dotenv.config();
import app from './app';

//handling uncaught exceptions
process.on('uncaughtException', err => {
  //IMPROVE: Log the rejections into a file
  console.error(`An uncaught exception occurred. Info: `, err);
  process.exit(1);
});

//starts the server
const port = process.env.APP_PORT || 8080;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  connectToDb();
});

//handling unhandled errors
process.on('unhandledRejection', err => {
  //IMPROVE: Log the rejections into a file
  console.error(`An unhandled rejection occurred. Info: `, err);
  
  //waits for all the processes to complete before shutting down the server
  server.close(() => {
    process.exit(1);
  })
});