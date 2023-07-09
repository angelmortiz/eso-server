import { ConfigInterface } from "../util/interfaces/configInterfaces";

const devConfig: ConfigInterface = {
  clientAddresses: ['http://localhost'],
  clientPort: '3000',
  serverAddress: 'http://localhost',
  serverPort: '8080',
};

export default devConfig;