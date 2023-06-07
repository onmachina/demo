import * as nearApi from "near-api-js";

const nearConfig = {
    networkId: 'testnet',
    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
    contractId: 'auth.onmachina.testnet',    
}

export async function initNearWalletConnection() {

  const near = await nearApi.connect(nearConfig);
  return new nearApi.WalletConnection(near, null)
}

export async function signIn() {
  const nearWalletConnection = await initNearWalletConnection();

  return nearWalletConnection.requestSignIn({
    contractId: nearConfig.contractId,
  });
}

export async function isSignedIn() {
  const nearWalletConnection = await initNearWalletConnection();
  console.log(nearWalletConnection);
  let bool = await nearWalletConnection.isSignedIn();
  return bool;
}

export async function returnWallet() {
  const nearWalletConnection = await initNearWalletConnection();
  return nearWalletConnection;
}

export async function signOut() {
  const nearWalletConnection = await initNearWalletConnection();

  return nearWalletConnection.signOut();
}

export async function getAccountId(): Promise<string> {
  const nearWalletConnection = await initNearWalletConnection();

  return nearWalletConnection.getAccountId();
}