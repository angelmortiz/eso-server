import { ConfigInterface } from "../util/interfaces/configInterfaces";

const devConfig: ConfigInterface = {
  env: 'development',
  clientAddresses: ['http://localhost'],
  clientPort: '3000',
  serverAddress: 'http://localhost',
  serverPort: '8080',
};

export default devConfig;