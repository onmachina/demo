import { Auth0Client } from '@auth0/auth0-spa-js';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { redirect } from 'react-router-dom';

import { AuthAdapter as AuthAdapterType } from '../auth';

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
    this.BASE_URL = import.meta.env.VITE_BASE_URL;
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

  private async getAuthClient(): Promise<any> {
    if (!this.authClient) {
      await this.initAuthClient();
    }
    return this.authClient!;
  }

  getAuthType(): 'auth0' {
    return 'auth0';
  }

  async isAuthenticated(): Promise<boolean> {
    const auth = await this.getAuthClient();
    console.log('checking if authenticated');
    return auth?.isAuthenticated();
  }

  async startAuth(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${this.BASE_URL}/finish-auth`,
        screen_hint: 'login',
      },
    });
  }

  async finishAuth(request: Request): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.handleRedirectCallback();
  }

  async logout(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.logout();
  }

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

  async refreshToken(): Promise<void> {
    const auth = await this.getAuthClient();
    return await auth.getTokenSilently({ cacheMode: 'off' });
  }

  async postCheckoutUrl(): Promise<string> {
    const state = await this.getState();
    return `https://${this.AUTH0_DOMAIN}/continue?state=${state}`;
  }

  async startSignup(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${this.BASE_URL}/finish-auth`,
        screen_hint: 'signup',
      },
    });
  }

  async startCheckout(): Promise<void> {
    this.saveState();
  }
  async finishCheckout(request: Request): Promise<Response> {
    const state = await this.getState();
    const url = new URL(request.url);
    const stripe_session_id = url.searchParams.get('session_id');
    return redirect(`https://${this.AUTH0_DOMAIN}/continue?state=${state}&stripe_session_id=${stripe_session_id}`);
  }
}

export const authAdapter: AuthAdapterType = new AuthAdapter();
