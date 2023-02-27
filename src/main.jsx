import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Near wallet related imports
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { Buffer } from 'buffer';
import '@near-wallet-selector/modal-ui/styles.css';
import * as nearAPI from 'near-api-js';

// Imports for elements used for routes
import Root from './routes/root';
import AccountPage from './routes/account';
import Upload, { action as uploadAction } from './routes/uploadObject';
import DeleteObject, { loader as deleteObjectLoader, action as deleteObjectAction } from './routes/deleteObject';
import DeleteContainer, {
  loader as deleteContainerLoader,
  action as deleteContainerAction,
} from './routes/deleteContainer';
import Details, { loader as detailsLoader } from './routes/objectDetails';
import ShardPage, { loader as shardLoader } from './routes/shard';
import ContainerPage, { loader as containerLoader } from './routes/container';

// Styles (index.css handles tailwindcss imports)
import './index.css';

// buffer pollyfill needed by Near Wallet Selector
globalThis.Buffer = Buffer;

const selector = await setupWalletSelector({
  network: 'testnet',
  modules: [setupNearWallet()],
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
    path: '/account/',
    element: (
      <Root>
        <AccountPage wallet={selectorWallet} />
      </Root>
    ),
  },
  {
    path: '/',
    element: (
      <Root>
        <ShardPage />
      </Root>
    ),
    loader: async ({ params }) => {
      return shardLoader(params, x_auth_token);
    },
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
            path: 'delete',
            action: deleteContainerAction,
            loader: async ({ params }) => {
              return deleteContainerLoader(params, x_auth_token);
            },
            element: <DeleteContainer authKey={x_auth_token} />,
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
                  return deleteObjectLoader(params, x_auth_token);
                },
                element: <DeleteObject authKey={x_auth_token} />,
                action: deleteObjectAction,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
