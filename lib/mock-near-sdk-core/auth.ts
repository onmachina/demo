import * as nearAPI from 'near-api-js';
import { base64Credentials } from './credentials';

export type NetworkId = 'sandbox' | 'testnet' | 'mainnet';

export async function nearAuthCredsUsingLocalKey(accountId: string, networkId: NetworkId, nodeUrl: string): Promise<string> {
  const keyFileName = `${require('os').homedir()}/.near-credentials/${networkId}/${accountId}.json`;

  let keyFile;

  try {
    keyFile = require(keyFileName);
  } catch (err) {
    throw new Error(`Account ${accountId} is not found for the ${networkId}.\
      Please, login with near CLI and try again.\
      File not found: ${keyFileName}.`);
  }

  const privKey = nearAPI.utils.KeyPair.fromString(
    keyFile.secret_key || keyFile.private_key
  );

  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  keyStore.setKey(networkId, accountId, privKey);

  const config = {
    networkId,
    nodeUrl,
    keyStore
  };

  return nearAuthCredentials(config, accountId);
}

export async function nearAuthCredentials(config: nearAPI.ConnectConfig, accountId: string, email?: string): Promise<string> {
  const near = await nearAPI.connect(config);

  const signer = near.connection.signer;

  const signerPublicKey = (
    await signer.getPublicKey(accountId, config.networkId)
  ).toString();

  const account = new nearAPI.Account(near.connection, accountId);

  const nonce = (await account.getAccessKeys())
    .find((k) => k.public_key === signerPublicKey)
    ?.access_key.nonce.toString();

  if (!nonce) {
    throw new Error(`Cannot find nonce for account ${accountId}`);
  }

  return base64Credentials(signer, accountId, config.networkId as NetworkId, nonce, email);
}
