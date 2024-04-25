import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import type { LoaderFunctionArgs } from 'react-router-dom';
import {
  Form,
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
  useFetcher,
  useLocation,
  useRouteLoaderData,
} from 'react-router-dom';
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
import { Error, Loading, LoggingIn } from './components/AppMessages';

// Styles (index.css handles tailwindcss imports)
import './index.css';

const router = createBrowserRouter([
  {
    path: '/login-result',
    async loader({ request }) {
      await auth0AuthProvider.handleSigninRedirect();
      // let isAuthenticated = await auth0AuthProvider.isAuthenticated();
      // if (isAuthenticated) {
      //   let redirectTo = new URLSearchParams(window.location.search).get('redirectTo') || '/';
      //   return redirect(redirectTo);
      // }
      return redirect('/');
    },
    Component: () => null,
  },
  {
    path: '/login',
    loader: loginLoader,
    Component: LoggingIn,
  },
  {
    path: '/logout',
    async loader() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await auth0AuthProvider.signout();
      return redirect('/');
    },
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
    errorElement: <Error />,
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
              return detailsLoader(params, accountId, x_auth_token);
            },
            children: [
              {
                path: 'delete',
                loader: async ({ params }) => {
                  return deleteObjectLoader(params, accountId, x_auth_token);
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

async function loginLoader() {
  let isAuthenticated = await auth0AuthProvider.isAuthenticated();
  if (!isAuthenticated) {
    await auth0AuthProvider.signin('redirect', '/login-result');
  } else {
    return redirect('/');
  }
  return null;
}

function LoginPage() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get('from') || '/';

  return <LoggingIn />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
