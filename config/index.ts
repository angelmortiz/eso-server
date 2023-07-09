import { ConfigInterface } from '../util/interfaces/configInterfaces';
const env = process.env.NODE_ENV || 'development';

const configs: { [key: string]: ConfigInterface } = {
  development: require('./development').default,
  production_local: require('./production_local').default,
  production: require('./production').default,
};

const config = configs[env];

config.redirectClientUrl =
  env === 'production'
    ? config.clientAddresses[0]
    : `${config.clientAddresses[0]}:${config.clientPort}`;

config.CORSClientUrls =
  env === 'production'
    ? config.clientAddresses
    : config.clientAddresses.map(
        (address) => `${address}:${config.clientPort}`
      );

config.serverUrl =
  env === 'production'
    ? config.serverAddress
    : `${config.serverAddress}:${config.serverPort}`;

export default config;
