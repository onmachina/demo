import { Auth0Client } from '@auth/auth-spa-js';
\import { json } from 'react-router-dom';

interface StripeCheckoutSessionDetails {
  stripe_client_secret: string | null;
  stripe_session_id: string | null;
}

class AuthProvider {
  private authClient: Auth0Client | nearAuthClient | null = null;
  private readonly AUTH0_DOMAIN: string;
  private readonly AUTH0_CLIENT_ID: string;
  private readonly AUTH0_STATE_KEY = 'auth.session.state';
  private readonly AUTH_TYPE_KEY = 'auth.session.type';

  constructor() {
    this.AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
    this.AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
    this.initAuthClient();
  }

  private async initAuthClient(): Promise<void> {
    const authType = sessionStorage.getItem(this.AUTH_TYPE_KEY);

    if (authType === 'near') {
      // Add NearAuth specific configuration here
    } else {
      // Default to Auth0 if no type is set or if it's set to 'auth0'
      const { createAuth0Client }: typeof Auth0Client = await import('@auth0/auth0-spa-js');
      this.authClient = await createAuth0Client({
        domain: this.AUTH0_DOMAIN,
        clientId: this.AUTH0_CLIENT_ID,
        useRefreshTokens: true,
        cacheLocation: 'localstorage',
        authorizationParams: { scope: 'openid email' },
      });
      sessionStorage.setItem(this.AUTH_TYPE_KEY, 'auth0');
    }
  }

  private async getAuthClient(): Promise<AuthClientType> {
    if (!this.authClient) {
      await this.initAuthClient();
    }
    return this.authClient!;
  }
  async isAuthenticated(): Promise<boolean> {
    const auth = await this.getAuthClient();
    return auth.isAuthenticated();
  }

  async startAuth(type: 'signup' | 'login', finish_auth_url: string): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: finish_auth_url,
        screen_hint: type,
      },
    });
  }

  async finishAuth(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.handleRedirectCallback();
  }

  async logout(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.logout();
  }

  stripeCheckoutUrl(request: Request): Promise<null | string> {
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    const stripe_checkout_url = url.searchParams.get('checkout_url');
    if (!state || !stripe_checkout_url) {
      return Promise.resolve(null);
    }
    sessionStorage.setItem(this.AUTH0_STATE_KEY, state);
    return Promise.resolve(stripe_checkout_url);
  }

  stripeCheckoutSessionDetails(request: Request): Promise<null | StripeCheckoutSessionDetails> {
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    const stripe_client_secret = url.searchParams.get('client_secret');
    const stripe_session_id = url.searchParams.get('session_id');
    if (!state || !stripe_client_secret) {
      return Promise.resolve(null);
    }
    sessionStorage.setItem(this.AUTH0_STATE_KEY, state);
    return Promise.resolve({ stripe_client_secret, stripe_session_id });
  }

  stripeFinishRedirectUrl(request: Request): Promise<null | string> {
    const url = new URL(request.url);
    const stripe_session_id = url.searchParams.get('session_id');
    const state = sessionStorage.getItem(this.AUTH0_STATE_KEY);
    return Promise.resolve(
      `https://${this.AUTH0_DOMAIN}/continue?state=${state}&stripe_session_id=${stripe_session_id}`,
    );
  }

  async username(): Promise<null | string> {
    const auth = await this.getAuthClient();
    const user = await auth.getUser();
    return user?.name || null;
  }

  async email(): Promise<null | string> {
    const auth = await this.getAuthClient();
    const user = await auth.getUser();
    return user?.email || null;
  }

  async avatarUrl(): Promise<null | string> {
    const auth = await this.getAuthClient();
    const user = await auth.getUser();
    return user?.picture || null;
  }

  async emailVerified(): Promise<boolean> {
    const auth = await this.getAuthClient();
    const user = await auth.getUser();
    return user?.email_verified || false;
  }

  async hasSubscription(): Promise<boolean> {
    const auth = await this.getAuthClient();
    const claims = await auth.getIdTokenClaims();
    return claims ? claims['has_subscription'] : false;
  }

  async accessToken(): Promise<null | string> {
    const auth = await this.getAuthClient();
    return auth.getTokenSilently({ cacheMode: 'on' });
  }

  async refreshToken(): Promise<void> {
    const auth = await this.getAuthClient();
    await auth.getTokenSilently({ cacheMode: 'off' });
  }

  async authenticatedFetch(path: string, options?: RequestInit): Promise<Response> {
    const email_verified = await this.emailVerified();
    if (!email_verified) {
      throw json({ code: 'ERR_EMAIL_NOT_VERIFIED' }, { status: 401 });
    }
    const token = await this.accessToken();
    const requestOpts = {
      ...options,
      headers: {
        ...options?.headers,
        'x-auth-token': token || '',
      },
    };
    const userEmail = await this.email();
    return fetch(`https://api.global01.onmachina.io/v1/${userEmail}${path}`, requestOpts);
  }

  async fetchMetrics(): Promise<any> {
    const email_verified = await this.emailVerified();
    if (!email_verified) {
      throw json({ code: 'ERR_EMAIL_NOT_VERIFIED' }, { status: 401 });
    }
    const accountID = await this.email();
    const token = await this.accessToken();
    console.log('metrics url', `https://api.global01.onmachina.io/metrics/${accountID}`);
    const response = await fetch(`https://api.global01.onmachina.io/metrics/${accountID}`, {
      headers: {
        'x-auth-token': token || '',
      },
    });
    if (!response.ok) {
      throw json({ code: 'ERR_STATS_UNAVAILABLE' }, { status: 401 });
    }
    return response.json();
  }
}

export const auth = new AuthProvider();
