import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import nearSetup from '../lib/nearsetup';

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

nearSetup().then(({ selectorWallet, accountId, x_auth_token }) => {
  const router = createBrowserRouter([
    {
      path: '/account/',
      element: (
        <Root>
          <AccountPage wallet={selectorWallet} accountId={accountId}/>
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
        return shardLoader(params, accountId, x_auth_token);
      },
      children: [
        {
          path: ':container',
          element: <ContainerPage />,
          loader: async ({ params }) => {
            return containerLoader(params, accountId, x_auth_token);
          },
          children: [
            {
              path: 'upload',
              action: uploadAction,
              element: <Upload accountId={accountId} authKey={x_auth_token} />,
            },
            {
              path: 'delete',
              action: deleteContainerAction,
              loader: async ({ params }) => {
                return deleteContainerLoader(params, accountId, x_auth_token);
              },
              element: <DeleteContainer accountId={accountId}  authKey={x_auth_token} />,
            },
            {
              path: ':object',
              element: <Details accountId={accountId}  authKey={x_auth_token} />,
              loader: async ({ params }) => {
                return detailsLoader(params, accountId, x_auth_token);
              },
              children: [
                {
                  path: 'delete',
                  loader: async ({ params }) => {
                    return deleteObjectLoader(params, accountId, x_auth_token);
                  },
                  element: <DeleteObject accountId={accountId}  authKey={x_auth_token} />,
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
});
