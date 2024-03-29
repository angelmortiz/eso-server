import { ConfigInterface } from '../util/interfaces/configInterfaces';

const prodConfig: ConfigInterface = {
  env: 'production',
  clientAddresses: ['http://localhost'],
  clientPort: '3000',
  serverAddress: 'http://localhost',
  serverPort: '8080',
};

export default prodConfig;