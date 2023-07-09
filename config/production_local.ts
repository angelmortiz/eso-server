import { ConfigInterface } from '../util/interfaces/configInterfaces';

const prodConfig: ConfigInterface = {
  clientAddresses: ['http://localhost'],
  clientPort: '3000',
  serverAddress: 'http://localhost',
  serverPort: '80',
};

export default prodConfig;