import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/root";
import KeyStore from './routes/keystore';
import Upload from './components/Upload';

import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { Buffer } from 'buffer';
import '@near-wallet-selector/modal-ui/styles.css';
import * as nearAPI from 'near-api-js';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'


const ContainerPage = React.lazy(() => import('./routes/container'));
import containerData from '../mock-data/get-container.json';

// buffer pollyfill needed by Near Wallet Selector
globalThis.Buffer = Buffer

const selector = await setupWalletSelector({
  network: 'testnet',
  modules: [setupNearWallet()],
});

const modal = setupModal(selector, {
  contractId: 'auth.onmachina.testnet',
});

modal.show();

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
const signerPublicKey = (
  await signer.getPublicKey(accountId, config.networkId)
).toString();

const account = new nearAPI.Account(near.connection, accountId);

const nonce = (await account.getAccessKeys())
  .find((k) => k.public_key === signerPublicKey)
  .access_key.nonce.toString();

const accountData = Buffer.from(JSON.stringify({ id: accountId, nonce }));
const signatureData = await signer.signMessage(
  accountData,
  accountId,
  networkId
);

const publicKey = Buffer.from(signatureData.publicKey.toString());
const signature = Buffer.from(signatureData.signature);

const authKey = Buffer.from(
  JSON.stringify({
    account: accountData.toString('base64'),
    publicKey: publicKey.toString('base64'),
    signature: signature.toString('base64'),
  })
).toString('base64');

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { 
        path: ":container", 
        element: <ContainerPage />,
        loader: async () => {
          return containerData;
        },
        children: [
          { path: "upload", element: <Upload authKey={authKey}/> },
        ]
      },
    ],
  },
  { path: "/keystore", element: <KeyStore /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);