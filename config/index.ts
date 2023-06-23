import { ConfigInterface } from '../util/interfaces/configInterfaces';
const env = process.env.NODE_ENV || 'development';

const configs: { [key: string]: ConfigInterface } = {
  development: require('./development').default,
  production: require('./production').default,
};

const config = configs[env];

config.clientUrl =
  env === 'production'
    ? config.clientAddress
    : `${config.clientAddress}:${config.clientPort}`;

config.serverUrl =
  env === 'production'
    ? config.serverAddress
    : `${config.serverAddress}:${config.serverPort}`;

export default config;
