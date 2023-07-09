import { ConfigInterface } from '../util/interfaces/configInterfaces';

const prodConfig: ConfigInterface = {
  clientAddresses: [
    'https://beta.ensaludoptima.com',
    'https://www.beta.ensaludoptima.com',
  ],
  clientPort: '443',
  serverAddress: 'http://eso-server-dev.us-east-1.elasticbeanstalk.com/api',
  serverPort: '80',
};

export default prodConfig;
