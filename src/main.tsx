import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';

// import types from react-router
import type { RouteObject } from 'react-router-dom';

// Imports for elements used for routes
import Root from './routes/root';
import Details, { loader as detailsLoader, action as objectPostAction } from './routes/objectDetails';
import ShardPage, { loader as shardLoader, action as shardAction } from './routes/shard';
import ContainerPage, { loader as containerLoader, action as containerPostAction } from './routes/container';
import SettingsPage from './routes/settings';
import { LoggingIn } from './components/AppMessages';
import { AccountStatus, loader as accountStatusLoader } from './routes/accountStatus';
import { Checkout } from './routes/checkout';

// authentication
import { auth0AuthProvider } from '../lib/auth';

// Styles (index.css handles tailwindcss imports)
import './index.css';
import ShardList from './routes/shardList';

const BASE_URL = 'http://localhost:3000';
console.log('base url is ' + BASE_URL);

const authRoutes: RouteObject[] = [
  {
    path: '/login',
    async loader() {
      await auth0AuthProvider.startAuth('login', `${BASE_URL}/finish-auth`);
      return null;
    },
    element: <LoggingIn />,
  },
  {
    path: '/finish-auth',
    async loader() {
      await auth0AuthProvider.finishAuth();
      return (await auth0AuthProvider.isAuthenticated()) ? redirect('/') : null;
    },
    element: <p>redirecting...</p>,
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
];

const signUpRoutes: RouteObject[] = [
  {
    path: '/signup',
    async loader() {
      await auth0AuthProvider.startAuth('signup', `${BASE_URL}/finish-auth`);
      return null;
    },
    element: <LoggingIn />,
  },
  {
    path: '/start-checkout',
    async loader({ request }) {
      const details = await auth0AuthProvider.stripeCheckoutSessionDetails(request);
      return details;
    },
    element: <Checkout />,
  },
  {
    path: '/finish-checkout',
    async loader({ request }) {
      const url = await auth0AuthProvider.stripeFinishRedirectUrl(request);
      return url ? redirect(url) : redirect('/');
    },
    element: <p>redirecting...</p>,
  },
];

const router = createBrowserRouter([
  ...authRoutes,
  ...signUpRoutes,
  {
    path: '/',
    element: (
      <Root>
        <ShardPage />
      </Root>
    ),
    loader: shardLoader,
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
          return containerLoader(params);
        },
        action: containerPostAction,
        children: [
          {
            path: ':object',
            element: <Details />,
            loader: async ({ params }) => {
              console.log('object loader');
              return detailsLoader(params);
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

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
