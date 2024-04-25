import { createAuth0Client } from '@auth0/auth0-spa-js';

interface AuthProvider {
  isAuthenticated(): Promise<boolean>;
  username(): Promise<null | string>;
  accessToken(): Promise<null | string>;
  signin(type: 'redirect' | 'popup', redirectTo: string): Promise<void>;
  handleSigninRedirect(): Promise<void>;
  signout(): Promise<void>;
  authenticatedFetch(url: string, init?: RequestInit): Promise<Response>;
}

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;

let auth0ClientPromise: ReturnType<typeof createAuth0Client>;

function getClient() {
  if (!auth0ClientPromise) {
    auth0ClientPromise = createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
    });
  }
  return auth0ClientPromise;
}

export const auth0AuthProvider: AuthProvider = {
  async isAuthenticated() {
    let client = await getClient();
    return client.isAuthenticated();
  },
  async username() {
    let client = await getClient();
    let user = await client.getUser();
    return user?.name || null;
  },

  async avatarUrl() {
    let client = await getClient();
    let user = await client.getUser();
    return user?.picture || null;
  },

  async accessToken() {
    let client = await getClient();
    return await client.getTokenSilently();
  },

  async signin(type: string, redirectTo: string) {
    let client = await getClient();
    if (type === 'redirect') {
      await client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin + '/login-result'.toString(),
        },
      });
    } else {
      await client.loginWithPopup();
    }
  },
  async handleSigninRedirect() {
    const query = window.location.search;
    if (query.includes('code=') && query.includes('state=')) {
      let client = await getClient();
      await client.handleRedirectCallback();
    }
  },
  async signout() {
    let client = await getClient();
    await client.logout();
  },

  async authenticatedFetch(url: string, options?: RequestInit) {
    const requestOpts = {
      ...options,
      headers: {
        ...options?.headers,
        'x-auth-token': await auth0AuthProvider.accessToken(),
      },
    };
    let isAuthenticated = await auth0AuthProvider.isAuthenticated();
    if (isAuthenticated) {
      const userName = await auth0AuthProvider.username();
      const authToken = await auth0AuthProvider.accessToken();
      return fetch(`https://api.global01.onmachina.io/v1/${userName}${url}`, requestOpts);
    }
  },
};
