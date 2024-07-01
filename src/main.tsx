import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';

// import types from react-router
import type { RouteObject } from 'react-router-dom';

// Imports for layouts
import { SidebarLayout, accountLoader } from './components/layouts/SidebarLayout';

// Imports for errors
import ErrorWindow from './components/errors/ErrorWindow';

// Imports for elements used for routes
import Root from './routes/root';
import ObjectDetails, { loader as objectLoader, action as objectAction } from './routes/objectDetails';
import ContainersView, { loader as containersLoader, action as containersAction } from './routes/containersView';
import ObjectsView, { loader as objectsLoader, action as objectsAction } from './routes/objectsView';
import SettingsView from './routes/settingsView';
import { LoggingIn } from './components/AppMessages';
import { AccountStatus, loader as accountStatusLoader } from './routes/accountStatus';
import { Checkout } from './routes/checkout';
import { UsageView, loader as usageLoader } from './routes/usageView';
import ShardListView from './routes/shardListView';

// authentication
import { auth0AuthProvider } from '../lib/auth';

// Styles (index.css handles tailwindcss imports)
import './index.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authRoutes: RouteObject[] = [
  {
    path: '/login',
    async loader() {
      await auth0AuthProvider.startAuth('login', `${BASE_URL}/finish-auth`);
      return null;
    },
    element: <LoggingIn />,
    errorElement: <ErrorWindow />,
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
    element: <SidebarLayout />,
    loader: accountLoader,
    errorElement: <ErrorWindow />,
    children: [
      {
        path: 'shard-list',
        element: <ShardListView />,
      },
      {
        path: 'settings',
        element: <SettingsView />,
      },
      {
        path: 'usage',
        element: <UsageView />,
        loader: usageLoader,
      },
      {
        path: '/',
        element: <ContainersView />,
        loader: containersLoader,
        action: containersAction,
        children: [
          {
            path: ':container',
            element: <ObjectsView />,
            loader: async ({ params }) => {
              return objectsLoader(params);
            },
            action: objectsAction,
            children: [
              {
                path: ':object',
                element: <ObjectDetails />,
                loader: async ({ params }) => {
                  console.log('object loader');
                  return objectLoader(params);
                },
                action: objectAction,
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

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
