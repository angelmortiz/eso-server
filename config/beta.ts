import { ConfigInterface } from '../util/interfaces/configInterfaces';

const betaConfig: ConfigInterface = {
  env: 'beta',
  clientAddresses: [
    'https://beta.ensaludoptima.com',
    'https://www.beta.ensaludoptima.com',
  ],
  betaUserRegistrationAddress: '/auth/beta-user-registration',
  clientPort: '443',
  serverAddress: 'https://beta.ensaludoptima.com',
  serverPort: '80',
};

export default betaConfig;
