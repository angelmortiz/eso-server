import path from 'path';

export default path.dirname(require?.main?.filename || process.env.PATH!); //gets the main file running the app