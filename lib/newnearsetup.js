// Near wallet related imports
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import '@near-wallet-selector/modal-ui/styles.css';
import * as nearAPI from 'near-api-js';
import { Buffer } from 'buffer';

// buffer pollyfill needed by Near Wallet Selector
globalThis.Buffer = Buffer;

const config = {
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  networkId: 'testnet',
};

let authAttemptsRemaining = 3;

// Returns the accountId of near wallet connected to the users browser
// If no wallet is connected, it will first prompt the user to connect a wallet via a modal
async function authWithNearWallet() {
  const selector = await setupWalletSelector({
    network: 'testnet',
    modules: [setupNearWallet(), setupMyNearWallet()],
  });

  const modal = setupModal(selector, {
    contractId: 'auth.onmachina.testnet',
  });

  if (!selector.isSignedIn()) modal.show();

  const selectorWallet = await selector.wallet();
  const selectorAccount = (await selectorWallet.getAccounts()).shift(); // Get the 1st account

  const accountId = selectorAccount.accountId;

  return { selectorWallet, selectorAccount, accountId, networkId: config.networkId };
}

// requests an auth token from the OnMachina service for the current near account
export async function newAuthTokenFromAPI(accountId) {
  const near = await nearAPI.connect(config);
  const signer = near.connection.signer;
  const signerPublicKey = (await signer.getPublicKey(accountId, config.networkId)).toString();

  const account = new nearAPI.Account(near.connection, accountId);

  const nonce = (await account.getAccessKeys())
    .find((k) => k.public_key === signerPublicKey)
    .access_key.nonce.toString();

  const accountData = Buffer.from(JSON.stringify({ id: accountId, nonce }));
  const signatureData = await signer.signMessage(accountData, accountId, config.networkId);

  const publicKey = Buffer.from(signatureData.publicKey.toString());
  console.log('publicKey: ', signatureData.publicKey.toString());
  const signature = Buffer.from(signatureData.signature);

  console.log('requesting auth token from OnMachina...');
  const credentials = Buffer.from(
    JSON.stringify({
      account: accountData.toString('base64'),
      publicKey: publicKey.toString('base64'),
      signature: signature.toString('base64'),
    }),
  ).toString('base64');

  const response = await fetch('https://auth.testnet.onmachina.io/auth/v1', {
    method: 'GET',
    headers: {
      'x-auth-user': accountId,
      'x-auth-key': credentials,
    },
  });

  // Retrieve the x-auth-token
  const x_auth_token = response.headers.get('x-auth-token');
  console.log('x_auth_token: ', x_auth_token);
  return x_auth_token;
}

export async function getAuthToken() {
  // Check if the authToken exists in local storage
  const storedAuthToken = localStorage.getItem('authToken');
  const storedAuthTokenIsValid = await authCheck(storedAuthToken);

  if (storedAuthToken && storedAuthTokenIsValid) {
    return storedAuthToken;
  } else {
    return await refreshAuthToken();
  }
}

export async function refreshAuthToken() {
  if (authAttemptsRemaining <= 0) {
    throw new Error('auth token refresh with OnMachina failed');
  }
  authAttemptsRemaining--;
  const { accountId } = await authWithNearWallet();
  const newAuthToken = await newAuthTokenFromAPI(accountId);
  localStorage.setItem('authToken', newAuthToken);
  return newAuthToken;
}

export async function authCheck(authToken) {
  const { accountId } = await authWithNearWallet();

  const res = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/?format=json`, {
    method: 'HEAD',
    headers: {
      'x-auth-token': authToken,
    },
  });
  // reset the authAttemptsRemaining if the auth token is valid
  if (res.status !== 401) authAttemptsRemaining = 3;
  return res.status !== 401;
}

export async function getAccountId() {
  const { accountId } = await authWithNearWallet();
  return accountId;
}

export async function isSignedIn() {
  const selector = await setupWalletSelector({
    network: 'testnet',
    modules: [setupNearWallet(), setupMyNearWallet()],
  });

  return selector.isSignedIn();
}

export default async function appInit() {
  const { selectorWallet, account, accountId } = await authWithNearWallet();
  const x_auth_token = await getAuthToken();
  return { selectorWallet, account, accountId, x_auth_token };
}
