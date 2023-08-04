export interface ConfigInterface {
  clientAddresses: string[];
  clientPort: string;
  redirectClientUrl?: string;
  CORSClientUrls?: string[];
  betaUserRegistrationAddress?: string;
  serverAddress: string;
  serverPort: string;
  serverUrl?: string;
  env: string;
}
