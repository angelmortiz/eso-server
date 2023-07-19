import { ConfigInterface } from '../util/interfaces/configInterfaces';
const env = process.env.NODE_ENV || 'development';

const configs: { [key: string]: ConfigInterface } = {
  development: require('./development').default,
  production_local: require('./production_local').default,
  production: require('./production').default,
  beta_local: require('./beta_local').default,
  beta: require('./beta').default,
};

const config = configs[env];

config.redirectClientUrl =
  env === 'production' || env === 'beta'
    ? config.clientAddresses[0]
    : `${config.clientAddresses[0]}:${config.clientPort}`;

config.CORSClientUrls =
  env === 'production' || env === 'beta'
    ? config.clientAddresses
    : config.clientAddresses.map(
        (address) => `${address}:${config.clientPort}`
      );

config.serverUrl =
  env === 'production' || env === 'beta'
    ? config.serverAddress
    : `${config.serverAddress}:${config.serverPort}`;

config.betaUserRegistrationAddress = `${config.redirectClientUrl}${config.betaUserRegistrationAddress}`;
export default config;
