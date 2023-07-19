import { ConfigInterface } from '../util/interfaces/configInterfaces';

const betaConfig: ConfigInterface = {
  env: 'beta_local',
  clientAddresses: ['http://localhost'],
  clientPort: '3000',
  betaUserRegistrationAddress: '/auth/beta-user-registration',
  serverAddress: 'http://localhost',
  serverPort: '8080',
};

export default betaConfig;
