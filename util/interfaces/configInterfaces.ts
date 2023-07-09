export interface ConfigInterface {
  clientAddresses: string[];
  clientPort: string;
  redirectClientUrl?: string;
  CORSClientUrls?: string[];
  serverAddress: string;
  serverPort: string;
  serverUrl?: string;
}
