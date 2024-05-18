import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { auth0AuthProvider } from './auth';

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
import AddContainer, { action as addContainerAction } from './routes/createContainer';
import SettingsPage from './routes/settings';
import ShardList from './routes/shardList';
import { LoggingIn } from './components/AppMessages';
import { ErrorWindow } from './components/errors/ErrorComponent';
import { AccountStatus, loader as accountStatusLoader } from './routes/AccountStatus';
import { Checkout } from './routes/Checkout';

// Styles (index.css handles tailwindcss imports)
import './index.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const router = createBrowserRouter([
  {
    path: '/login',
    async loader() {
      await auth0AuthProvider.startAuth('login', `${BASE_URL}/finish-auth`);
      return null;
    },
    Component: LoggingIn,
  },
  {
    path: '/signup',
    async loader() {
      await auth0AuthProvider.startAuth('signup', `${BASE_URL}/finish-auth`);
      return null;
    },
    Component: LoggingIn,
  },
  {
    path: '/start-checkout',
    async loader({ request }) {
      const clientSecret = await auth0AuthProvider.stripeCheckoutSessionDetails(request);
      return clientSecret;
    },
    Component: <Checkout />,
  },
  {
    path: '/finish-checkout',
    async loader({ request }) {
      const url = await auth0AuthProvider.stripeFinishRedirectUrl(request);
      return url ? redirect(url) : redirect('/');
    },
    Component: () => <p>redirecting...</p>,
  },
  {
    path: '/finish-auth',
    async loader() {
      await auth0AuthProvider.finishAuth();
      return (await auth0AuthProvider.isAuthenticated()) ? redirect('/') : null;
    },
    Component: () => <p>redirecting...</p>,
  },
  {
    path: '/logout',
    async loader() {
      await auth0AuthProvider.logout();
      return redirect('/');
    },
  },
  {
    path: '/account-status',
    element: <AccountStatus />,
    loader: accountStatusLoader,
  },
  {
    id: 'root',
    path: '/',
    loader: shardLoader,
    element: (
      <Root>
        <ShardPage />
      </Root>
    ),
    errorElement: <ErrorWindow />,
    children: [
      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'shard-list',
        element: <ShardList />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'new-container',
        element: <AddContainer />,
        action: addContainerAction,
        errorElement: <ErrorWindow />,
      },
      {
        path: ':container',
        element: <ContainerPage />,
        loader: async ({ params }) => {
          return containerLoader(params);
        },
        children: [
          {
            path: 'upload',
            action: uploadAction,
            element: <Upload />,
          },
          {
            path: 'delete',
            loader: async ({ params }) => {
              return deleteContainerLoader(params);
            },
            action: deleteContainerAction,
            element: <DeleteContainer />,
          },
          {
            path: ':object',
            element: <Details />,
            loader: async ({ params }) => {
              return detailsLoader(params);
            },
            children: [
              {
                path: 'delete',
                loader: async ({ params }) => {
                  return deleteObjectLoader(params);
                },
                element: <DeleteObject />,
                action: deleteObjectAction,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
