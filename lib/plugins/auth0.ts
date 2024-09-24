import { Auth0Client } from '@auth0/auth0-spa-js';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { redirect } from 'react-router-dom';

import { AuthAdapter as AuthAdapterType } from '../auth';

/* sets unique API URLs for the auth provider */
const apiURL: string = import.meta.env.VITE_AUTH0_API_URL + '/v1';
const metricsURL: string = import.meta.env.VITE_AUTH0_API_URL + '/metrics';

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
  private readonly AUTH0_DOMAIN: string;
  private readonly AUTH0_CLIENT_ID: string;
  private readonly AUTH0_STATE_KEY = 'auth.session.state';
  private authClient: Auth0Client | null = null;
  private readonly BASE_URL: string;

  constructor() {
    this.AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
    this.AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
    this.BASE_URL = import.meta.env.BASE_URL || import.meta.env.VITE_AUTH0_DEV_BASE_URL;
    this.initAuthClient();
  }

  private async initAuthClient(): Promise<void> {
    this.authClient = await createAuth0Client({
      domain: this.AUTH0_DOMAIN,
      clientId: this.AUTH0_CLIENT_ID,
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: { scope: 'openid email' },
    });
  }

  private async saveState() {
    const url = new URL(window.location.href);
    const state = url.searchParams.get('state');
    if (!state) {
      throw new Error('Cannot save state. No state parameter found.');
    }
    sessionStorage.setItem(this.AUTH0_STATE_KEY, state);
  }

  private async getState(): Promise<string | null> {
    return sessionStorage.getItem(this.AUTH0_STATE_KEY);
  }

  /* returns an instance of the Auth0Client,
     initializing it if necessary */
  private async getAuthClient(): Promise<any> {
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
    return apiURL;
  }

  getMetricsUrl(): string {
    return metricsURL;
  }

  /* returns true if the user is authenticated */
  async isAuthenticated(): Promise<boolean> {
    const auth = await this.getAuthClient();
    console.log('checking if authenticated');
    return auth?.isAuthenticated();
  }

  /* called from the login page to authenticate the user */
  async startLogin(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${this.BASE_URL}/finish-auth`,
        screen_hint: 'login',
      },
    });
  }

  /* called from '/finish-auth' as a callback from Auth0 */
  async finishAuth(request: Request): Promise<void> {
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
    return await auth.getTokenSilently({ cacheMode: 'off' });
  }

  /* called from the signup page to bring users
     to Auth0 in signup mode */
  async startSignup(_email: string | null): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${this.BASE_URL}/finish-auth`,
        screen_hint: 'signup',
      },
    });
  }

  async startCheckout(_request: Request): Promise<string | null> {
    this.saveState();
    return null;
  }

  /* called from '/finish-checkout' as a callback from Stripe */
  async finishCheckout(request: Request): Promise<Response | null> {
    const state = await this.getState();
    const url = new URL(request.url);
    const stripe_session_id = url.searchParams.get('session_id');
    return redirect(`https://${this.AUTH0_DOMAIN}/continue?state=${state}&stripe_session_id=${stripe_session_id}`);
  }

  async handleCustomRedirect(request: Request): Promise<Response | null> {
    return null;
  }
}

export const authAdapter: AuthAdapterType = new AuthAdapter();
