import { ConfigInterface } from '../util/interfaces/configInterfaces';

const betaConfig: ConfigInterface = {
  env: 'beta',
  clientAddresses: ['http://localhost'],
  clientPort: '3000',
  betaUserRegistrationAddress: '/beta-user-registration',
  serverAddress: 'http://localhost',
  serverPort: '8080',
};

export default betaConfig;
