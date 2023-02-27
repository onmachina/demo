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

nearSetup().then(({ selectorWallet, x_auth_token }) => {
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
});
