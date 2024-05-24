import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { action as shardAction } from './routes/shard';

// Imports for elements used for routes
import Root from './routes/root';
import AccountPage from './routes/account';

import Details, { loader as detailsLoader } from './routes/objectDetails';
import ShardPage, { loader as shardLoader } from './routes/shard';
import ContainerPage, { loader as containerLoader } from './routes/container';
import SettingsPage from './routes/settings';
import { action as objectPostAction } from './routes/objectDetails';
import { action as containerPostAction } from './routes/container';

// Styles (index.css handles tailwindcss imports)
import './index.css';
import ShardList from './routes/shardList';

const router = createBrowserRouter([
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
    action: shardAction,
    children: [
      {
        path: 'shard-list',
        element: <ShardList />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: ':container',
        element: <ContainerPage />,
        loader: async ({ params }) => {
          return containerLoader(params, accountId, x_auth_token);
        },
        action: containerPostAction,
        children: [
          {
            path: ':object',
            element: <Details accountId={accountId} authKey={x_auth_token} />,
            loader: async ({ params }) => {
              console.log('object loader');
              return detailsLoader(params, accountId, x_auth_token);
            },
            action: objectPostAction,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
