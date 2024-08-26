import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { nearAuthCredentials, NetworkId } from '../mock-near-sdk-core/';
import { keyStores } from 'near-api-js';

export async function getWalletSelector(networkId: NetworkId): Promise<WalletSelector> {
  if (networkId === 'sandbox') throw new Error(`NEAR network 'sandbox' not supported`);

  return setupWalletSelector({
    network: networkId,
    modules: [setupMeteorWallet(), setupMyNearWallet()],
  });
}

export async function credentialsFromWalletSelector(networkId: NetworkId, email?: string): Promise<string> {
  const selector = await getWalletSelector(networkId);

  if (!selector.isSignedIn()) throw new Error(`NEAR account not chosen`);

  const selectorWallet = await selector.wallet();
  const selectorAccount = (await selectorWallet.getAccounts()).shift(); // Get the 1st account
  const accountId = selectorAccount?.accountId;

  if (!accountId) throw new Error('Account ID not found');

  const nodeUrl = selector.options.network.nodeUrl;

  return nearAuthCredentials(
    {
      networkId,
      nodeUrl,
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    },
    accountId,
    email,
  );
}
