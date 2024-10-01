import { NearAuthClient, NetworkId } from '@onmachina/nearauth-sdk-wallet';

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
const apiURL: string = import.meta.env.VITE_NEAR_API_URL + '/v1';
const metricsURL: string = import.meta.env.VITE_NEAR_API_URL + '/metrics';

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

  private async getAuthClient(): Promise<NearAuthClient> {
    if (!this.authClient) {
      await this.initAuthClient();
    }
    return this.authClient!;
  }

  getAuthType(): 'near' {
    return 'near';
  }

  getApiUrl(): string {
    return apiURL;
  }

  getMetricsUrl(): string {
    return metricsURL;
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
    return this.authClient.signupWithRedirect(email);
  }

  async startCheckout(request: Request): Promise<string | null> {
    const url = new URL(request.url);
    return url.searchParams.get('checkout_url') || '/';
  }

  async finishCheckout(request: Request): Promise<Response | null> {
    await this.handleCustomRedirect(request);
    return null;
  }

  async handleCustomRedirect(request: Request): Promise<boolean> {
    const url = new URL(request.url);
    const afterWalletRedirect = url.searchParams.get('account_id') ? true : false; // After NEAR Wallet Selector.
    const sessionId = url.searchParams.get('session_id') ?? undefined; // After Stripe checkout.
    return this.authClient.handleRedirect(afterWalletRedirect, sessionId);
  }
}

export const authAdapter: AuthAdapterType = new AuthAdapter();
