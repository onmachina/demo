import { NearAuthClient, NetworkId } from '@onmachina/nearauth-sdk-wallet';
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

/* sets unique API URLs for the auth provider */
const API_URL: string = import.meta.env.VITE_NEAR_API_URL + '/v1';
const METRICS_URL: string = import.meta.env.VITE_NEAR_API_URL + '/metrics';
const BASE_URL: string = import.meta.env.VITE_BASE_URL;

class AuthAdapter {
  private authClient: NearAuthClient | null = null;
  private readonly NEARAUTH_URL: string;
  private readonly NEAR_NETWORK_ID: NetworkId;

  constructor() {
    this.NEARAUTH_URL = import.meta.env.VITE_NEARAUTH_URL;
    this.NEAR_NETWORK_ID = import.meta.env.VITE_NEAR_NETWORK_ID as NetworkId;
    this.initAuthClient();
  }

  private async initAuthClient(): Promise<void> {
    this.authClient = new NearAuthClient({
      baseUrl: this.NEARAUTH_URL,
      nearNetworkId: this.NEAR_NETWORK_ID,
    });
  }

  getAuthType(): 'near' {
    return 'near';
  }

  getApiUrl(): string {
    return API_URL;
  }

  getMetricsUrl(): string {
    return METRICS_URL;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.authClient.isAuthenticated();
  }

  async startLogin(): Promise<void> {
    await this.authClient.loginWithRedirect();
  }

  async finishAuth(): Promise<void> {
    console.log('finishing auth should not be called for NEAR');
    return null;
  }

  async logout(): Promise<void> {
    await this.authClient.logout();
  }

  async getUser(): Promise<User> {
    const user = await this.authClient.getUser();
    console.log('user from NEAR auth plugin', user);
    const accessToken = await this.authClient.getTokenSilently();
    return {
      name: user?.accountId || null,
      email: null,
      avatarUrl: null,
      emailVerified: true,
      hasSubscription: true,
      accessToken: {
        value: accessToken || null,
        expiresAt: user?.access_token_expires_at || null,
      },
    } as User;
  }

  async refreshToken(): Promise<void> {
    return this.authClient.loginWithRedirect(); // Just get the new JWT.
  }

  async startSignup(email: string): Promise<void> {
    return this.authClient.signupWithRedirect(email, BASE_URL);
  }

  async startCheckout(request: Request): Promise<string | null> {
    const url = new URL(request.url);
    return url.searchParams.get('checkout_url') || '/';
  }

  async finishCheckout(request: Request): Promise<Response | null> {
    await this.handleCustomRedirect(request);
    return redirect('/');
  }

  async handleCustomRedirect(request: Request): Promise<boolean> {
    const url = new URL(request.url);
    const afterWalletRedirect = url.searchParams.get('account_id') ? true : false; // After NEAR Wallet Selector.
    const sessionId = url.searchParams.get('session_id') ?? undefined; // After Stripe checkout.
    return this.authClient.handleRedirect(afterWalletRedirect, sessionId);
  }
}

export const authAdapter: AuthAdapterType = new AuthAdapter();
