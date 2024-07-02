import { createAuth0Client } from '@auth0/auth0-spa-js';
import { json } from 'react-router-dom';

interface AuthProvider {
  isAuthenticated(): Promise<boolean>;
  startAuth(type: 'signup' | 'login', finish_auth_url: string): Promise<void>;
  finishAuth(): Promise<void>;
  logout(): Promise<void>;
  stripeCheckoutUrl(request: Request): Promise<null | string>;
  stripeCheckoutSessionDetails(request: Request): Promise<null | stripeCheckoutSessionDetails>;
  stripeFinishRedirectUrl(request: Request): Promise<null | string>;
  email(): Promise<null | string>;
  username(): Promise<null | string>;
  avatarUrl(): Promise<null | string>;
  emailVerified(): Promise<boolean>;
  hasSubscription(): Promise<boolean>;
  accessToken(): Promise<null | string>;
  refreshToken(): Promise<void>;
  authenticatedFetch(path: string, options?: RequestInit): Promise<Response>;
  fetchMetrics(accountId: string): Promise<Response>;
}

interface stripeCheckoutSessionDetails {
  stripe_client_secret: string | null;
  stripe_session_id: string | null;
}

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_STATE_KEY = 'auth0.session.state';

let auth0ClientPromise: ReturnType<typeof createAuth0Client>;

function auth0Client() {
  if (!auth0ClientPromise) {
    auth0ClientPromise = createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: { scope: 'openid email' },
    });
  }
  return auth0ClientPromise;
}

export const auth0AuthProvider: AuthProvider = {
  async isAuthenticated() {
    let auth0 = await auth0Client();
    return auth0.isAuthenticated();
  },

  async startAuth(type: 'signup' | 'login', finish_auth_url: string) {
    const auth0 = await auth0Client();

    await auth0.loginWithRedirect({
      authorizationParams: {
        redirect_uri: finish_auth_url,
        screen_hint: type,
      },
    });
  },

  async finishAuth() {
    const auth0 = await auth0Client();
    await auth0.handleRedirectCallback();
  },

  async logout() {
    let auth0 = await auth0Client();
    await auth0.logout();
  },

  async stripeCheckoutUrl(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    const stripe_checkout_url = url.searchParams.get('checkout_url');
    if (!state || !stripe_checkout_url) {
      return null;
    }
    sessionStorage.setItem(AUTH0_STATE_KEY, state);
    return stripe_checkout_url;
  },

  async stripeCheckoutSessionDetails(request: Request): Promise<null | stripeCheckoutSessionDetails> {
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    const stripe_client_secret = url.searchParams.get('client_secret');
    const stripe_session_id = url.searchParams.get('session_id');
    if (!state || !stripe_client_secret) {
      return null;
    }
    sessionStorage.setItem(AUTH0_STATE_KEY, state);
    return { stripe_client_secret, stripe_session_id };
  },

  async stripeFinishRedirectUrl(request: Request) {
    const url = new URL(request.url);
    const stripe_session_id = url.searchParams.get('session_id');
    const state = sessionStorage.getItem(AUTH0_STATE_KEY);
    return `https://${AUTH0_DOMAIN}/continue?state=${state}&stripe_session_id=${stripe_session_id}`;
  },

  async username() {
    let auth0 = await auth0Client();
    let user = await auth0.getUser();
    return user?.name || null;
  },

  async email() {
    let auth0 = await auth0Client();
    let user = await auth0.getUser();
    return user?.email || null;
  },

  async avatarUrl() {
    let auth0 = await auth0Client();
    let user = await auth0.getUser();
    return user?.picture || null;
  },

  async emailVerified() {
    let auth0 = await auth0Client();
    let user = await auth0.getUser();
    return user?.email_verified || false;
  },

  async hasSubscription() {
    let auth0 = await auth0Client();
    const claims = await auth0.getIdTokenClaims();
    console.log('HERE ARE THE CLAIMS:');
    console.log(claims);
    const subscribed = claims ? claims['has_subscription'] : false;
    return subscribed;
  },

  async accessToken() {
    let auth0 = await auth0Client();
    return await auth0.getTokenSilently({ cacheMode: 'on' });
  },

  async refreshToken() {
    let auth0 = await auth0Client();
    await auth0.getTokenSilently({ cacheMode: 'off' });
  },

  async authenticatedFetch(path: string, options?: RequestInit) {
    const email_verified = await auth0AuthProvider.emailVerified();
    if (!email_verified) {
      throw json(
        {
          code: 'ERR_EMAIL_NOT_VERIFIED',
        },
        { status: 401 },
      );
    }
    const token = await auth0AuthProvider.accessToken();
    const requestOpts = {
      ...options,
      headers: {
        ...options?.headers,
        'x-auth-token': token || '',
      },
    };
    const userEmail = await auth0AuthProvider.email();
    return fetch(`https://api.global01.onmachina.io/v1/${userEmail}${path}`, requestOpts);
  },

  async fetchMetrics() {
    const email_verified = await auth0AuthProvider.emailVerified();
    if (!email_verified) {
      throw json(
        {
          code: 'ERR_EMAIL_NOT_VERIFIED',
        },
        { status: 401 },
      );
    }
    const accountID = await auth0AuthProvider.email();
    const token = await auth0AuthProvider.accessToken();
    console.log('metrics url', `https://api.global01.onmachina.io/metrics/${accountID}`);
    const response = await fetch(`https://api.global01.onmachina.io/metrics/${accountID}`, {
      headers: {
        'x-auth-token': token || '',
      },
    });
    if (!response.ok) {
      throw json(
        {
          code: 'ERR_STATS_UNAVAILABLE',
        },
        { status: 401 },
      );
    }
    const data = await response.json();
    return data;
  },
};
