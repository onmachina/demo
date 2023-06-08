// Near wallet related imports
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import '@near-wallet-selector/modal-ui/styles.css';
import * as nearAPI from 'near-api-js';
import * as onMachina from './onmachina';
import { Buffer } from 'buffer';

// buffer pollyfill needed by Near Wallet Selector
globalThis.Buffer = Buffer;

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
const networkId = 'testnet';

const config = {
  networkId,
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
};

const near = await nearAPI.connect(config);
const signer = near.connection.signer;
const signerPublicKey = (await signer.getPublicKey(accountId, config.networkId)).toString();

const account = new nearAPI.Account(near.connection, accountId);

const nonce = (await account.getAccessKeys()).find((k) => k.public_key === signerPublicKey).access_key.nonce.toString();

const accountData = Buffer.from(JSON.stringify({ id: accountId, nonce }));
const signatureData = await signer.signMessage(accountData, accountId, networkId);

const publicKey = Buffer.from(signatureData.publicKey.toString());
console.log('publicKey: ', signatureData.publicKey.toString());
const signature = Buffer.from(signatureData.signature);

export default async function nearSetup() {
  const x_auth_token = await onMachina.getAuthToken(accountId);
  return { selectorWallet, account, accountId, x_auth_token };
}

export async function getAccountId() {
  return accountId;
}

export async function isSignedIn() {
  return selector.isSignedIn();
}
