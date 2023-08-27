import { ConfigInterface } from '../util/interfaces/configInterfaces';

const prodConfig: ConfigInterface = {
  env: 'production',
  clientAddresses: [
    'https://beta.ensaludoptima.com',
    'https://www.beta.ensaludoptima.com',
  ],
  clientPort: '443',
  serverAddress: 'https://beta.ensaludoptima.com/api',
  serverPort: '80',
};

export default prodConfig;
