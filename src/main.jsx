import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './routes/root';
import KeyStore from './routes/keystore';
import Upload, { action as uploadAction } from './routes/uploadObject';
import DeleteObject, { loader as deleteLoader, action as deleteAction } from './routes/deleteObject';

import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { Buffer } from 'buffer';
import '@near-wallet-selector/modal-ui/styles.css';
import * as nearAPI from 'near-api-js';

import Details, { loader as detailsLoader } from './routes/objectDetails';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import ContainerPage, { loader as containerLoader } from './routes/container';
('./routes/container');

// buffer pollyfill needed by Near Wallet Selector
globalThis.Buffer = Buffer;

const selector = await setupWalletSelector({
  network: 'testnet',
  modules: [setupNearWallet()],
});

const modal = setupModal(selector, {
  contractId: 'auth.onmachina.testnet',
});

const selectorWallet = await selector.wallet();
const selectorAccount = (await selectorWallet.getAccounts()).shift(); // Get the 1st account

if (!selectorAccount) {
  modal.show();
}

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
const signature = Buffer.from(signatureData.signature);

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
    'x-auth-user': 'any',
    'x-auth-key': credentials,
  },
});

// Retrieve the x-auth-token
const x_auth_token = response.headers.get('x-auth-token');

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: ':container',
        element: <ContainerPage />,
        loader: async ({ params }) => {
          return containerLoader(params, x_auth_token);
        },
        children: [
          {
            path: 'upload',
            action: uploadAction,
            element: <Upload authKey={x_auth_token} />,
          },
          {
            path: ':object',
            element: <Details authKey={x_auth_token} />,
            loader: async ({ params }) => {
              return detailsLoader(params, x_auth_token);
            },
            children: [
              {
                path: 'delete',
                loader: async ({ params }) => {
                  return deleteLoader(params, x_auth_token);
                },
                element: <DeleteObject authKey={x_auth_token} />,
                action: deleteAction,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '/keystore', element: <KeyStore /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
