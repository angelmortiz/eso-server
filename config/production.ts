import { ConfigInterface } from "../util/interfaces/configInterfaces";

const prodConfig: ConfigInterface = {
  /** //FIXME: Code changed for testing purses */
  // clientAddress: 'https://www.alpha.ensaludoptima.com',
  // clientPort: '443',
  // serverAddress: 'https://www.alpha.ensaludoptima.com/api',
  // serverPort: '443'
  clientAddress: 'http://24.139.212.50',
  clientPort: '3000',
  serverAddress: 'http://eso-server-dev.us-east-1.elasticbeanstalk.com/api',
  serverPort: '80',
};

export default prodConfig;