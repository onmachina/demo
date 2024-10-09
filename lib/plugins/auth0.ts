import { Auth0Client } from '@auth0/auth0-spa-js';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { redirect } from 'react-router-dom';

import { AuthAdapter as AuthAdapterType } from '../auth';

/* sets unique API URLs for the auth provider */
const AUDIENCE: string = import.meta.env.VITE_AUTH0_API_URL + '/';
const API_URL: string = import.meta.env.VITE_AUTH0_API_URL + '/v1';
const METRICS_URL: string = import.meta.env.VITE_AUTH0_API_URL + '/metrics';
const AUTH0_DOMAIN: string = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_STATE_KEY: string = 'auth0.session.state';
const AUTH0_CLIENT_ID: string = import.meta.env.VITE_AUTH0_CLIENT_ID;
const BASE_URL: string = import.meta.env.VITE_BASE_URL;

interface User {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  hasSubscription: boolean;
  accessToken: {
    value: string | null;
    expiresAt: number | null;
  };
}

class AuthAdapter {
  private authClient: Auth0Client | null = null;

  constructor() {
    this.initAuthClient();
  }

  private async initAuthClient(): Promise<void> {
    this.authClient = await createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: {
        audience: AUDIENCE,
      },
    });
  }

  private async saveState() {
    const url = new URL(window.location.href);
    const state = url.searchParams.get('state');
    if (!state) {
      throw new Error('Cannot save state. No state parameter found.');
    }
    sessionStorage.setItem(AUTH0_STATE_KEY, state);
  }

  private async getState(): Promise<string | null> {
    return sessionStorage.getItem(AUTH0_STATE_KEY);
  }

  /* returns an instance of the Auth0Client,
     initializing it if necessary */
  private async getAuthClient(): Promise<Auth0Client> {
    if (!this.authClient) {
      await this.initAuthClient();
    }
    return this.authClient!;
  }

  /* Public methods used by the app */
  /* all plugins must implement these methods */

  /* returns a string indicating the type of auth provider */
  getAuthType(): 'auth0' {
    return 'auth0';
  }

  getApiUrl(): string {
    return API_URL;
  }

  getMetricsUrl(): string {
    return METRICS_URL;
  }

  /* returns true if the user is authenticated */
  async isAuthenticated(): Promise<boolean> {
    const auth = await this.getAuthClient();
    console.log('checking if authenticated');
    try {
      // Check any refresh token exceptions which might hit later.
      // isAuthenticated reads from the local storage (getUser).
      await auth.getTokenSilently({ cacheMode: 'on' });
      return auth.isAuthenticated();
    } catch (e) {
      return false;
    }
  }

  /* called from the login page to authenticate the user */
  async startLogin(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${BASE_URL}/finish-auth`,
        screen_hint: 'login',
      },
    });
  }

  /* called from '/finish-auth' as a callback from Auth0 */
  async finishAuth(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.handleRedirectCallback();
  }

  /* logs the user out, in use on the '/logout' route  */
  async logout(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.logout();
  }

  /* returns a user object containing the user's information */
  async getUser(): Promise<User> {
    const auth = await this.getAuthClient();
    const user = await auth.getUser();
    const accessToken = await auth.getTokenSilently({ cacheMode: 'on' });
    return {
      name: user?.email || null,
      email: user?.email || null,
      avatarUrl: user?.picture || null,
      emailVerified: user?.email_verified || false,
      hasSubscription: user?.['has_subscription'] || false,
      accessToken: {
        value: accessToken || null,
        expiresAt: user?.access_token_expires_at || null,
      },
    } as User;
  }

  /* refreshes the user's access token */
  async refreshToken(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.getTokenSilently({ cacheMode: 'off' });
  }

  /* called from the signup page to bring users
     to Auth0 in signup mode */
  async startSignup(_email: string | null): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${BASE_URL}/finish-auth`,
        screen_hint: 'signup',
      },
    });
  }

  async startCheckout(request: Request): Promise<any> {
    this.saveState();
    const url = new URL(request.url);
    const stripe_client_secret = url.searchParams.get('client_secret');
    const stripe_session_id = url.searchParams.get('session_id');
    if (!stripe_client_secret || !stripe_client_secret) {
      return null;
    }
    return { stripe_client_secret, stripe_session_id };
  }

  /* called from '/finish-checkout' as a callback from Stripe */
  async finishCheckout(request: Request): Promise<Response | null> {
    const state = await this.getState();
    const url = new URL(request.url);
    const stripe_session_id = url.searchParams.get('session_id');
    return redirect(`https://${AUTH0_DOMAIN}/continue?state=${state}&stripe_session_id=${stripe_session_id}`);
  }

  async handleCustomRedirect(_request: Request): Promise<boolean> {
    return false;
  }
}

export const authAdapter: AuthAdapterType = new AuthAdapter();
