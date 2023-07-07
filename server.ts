import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { connectToDb } from './util/database/connection';
import app from './app';
import config from './config';

//handling uncaught exceptions
process.on('uncaughtException', (err) => {
  //IMPROVE: Log the rejections into a file
  console.error(`An uncaught exception occurred. Info: `, err);
  process.exit(1);
});

//starts the server
const port = config.serverPort || 8080;
const server = app.listen(port, () => {
  console.log(`Node.js server running on address '${config.serverUrl}'.`);
  connectToDb();
});

//handling unhandled errors
process.on('unhandledRejection', (err) => {
  //IMPROVE: Log the rejections into a file
  console.error(`An unhandled rejection occurred. Info: `, err);

  //waits for all the processes to complete before shutting down the server
  server.close(() => {
    process.exit(1);
  });
});
