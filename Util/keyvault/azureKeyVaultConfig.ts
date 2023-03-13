import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const credential = new DefaultAzureCredential();
const client = new SecretClient(process.env.AZURE_KEY_VAULT_URI!, credential);

const getVaultSecret = async (name: string): Promise<string | undefined> => {
  const secret = await client.getSecret(name);
  return secret.value;
};

export default getVaultSecret;
