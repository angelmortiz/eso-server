import { ConfigInterface } from '../util/interfaces/configInterfaces';

const betaConfig: ConfigInterface = {
  env: 'beta',
  clientAddresses: [
    'https://beta.ensaludoptima.com',
    'https://www.beta.ensaludoptima.com',
  ],
  betaUserRegistrationAddress: '/beta-user-registration',
  clientPort: '443',
  serverAddress: 'http://eso-server-dev.us-east-1.elasticbeanstalk.com/api',
  serverPort: '80',
};

export default betaConfig;
