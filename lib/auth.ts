/* all auth adapters (plugins) should implement this interface */
export interface AuthAdapter {
  isAuthenticated(): Promise<boolean>;
  startAuth(): Promise<void>;
  finishAuth(request: Request): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  refreshToken(): Promise<void>;
  postCheckoutUrl(): Promise<string>;
  startSignup(email: string | null): Promise<void>;
  startCheckout(): Promise<void>;
  finishCheckout(request: Request): Promise<any>;
  getAuthType(): string;
  getApiUrl(): string;
  getMetricsUrl(): string;
}
interface AuthProviderType {
  isAuthenticated(): Promise<boolean>;
  startAuth(): Promise<void>;
  finishAuth(request: Request): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  refreshToken(): Promise<void>;
  postCheckoutUrl(): Promise<string>;
  startSignup(email: string | null): Promise<void>;
  startCheckout(): Promise<void>;
  finishCheckout(request: Request): Promise<any>;
  getAuthType(): Promise<string>;
  getApiUrl(): Promise<string>;
  getMetricsUrl(): Promise<string>;
}

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

class AuthProvider {
  private readonly AUTH_TYPE_KEY = 'auth.session.type';
  private authAdapter: AuthAdapter | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initAuthClient();
  }

  private async initAuthClient(): Promise<void> {
    const authType = sessionStorage.getItem(this.AUTH_TYPE_KEY);

    if (authType === 'near') {
      const { authAdapter: nearAdapter } = await import('./plugins/near');
      this.authAdapter = nearAdapter;
    } else if (authType === 'auth0' || !authType) {
      const { authAdapter: auth0Adapter } = await import('./plugins/auth0');
      this.authAdapter = auth0Adapter;
      if (!authType) {
        sessionStorage.setItem(this.AUTH_TYPE_KEY, 'auth0');
      }
    }
  }

  private ensureInitialized(): void {
    if (!this.authAdapter) {
      throw new Error('AuthProvider not initialized');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.isAuthenticated();
  }

  async startAuth(): Promise<void> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.startAuth();
  }

  async finishAuth(request: Request): Promise<void> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.finishAuth(request);
  }

  async logout(): Promise<void> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.logout();
  }

  async getUser(): Promise<User> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.getUser() as Promise<User>;
  }

  async accessToken(): Promise<string> {
    await this.initPromise;
    this.ensureInitialized();
    const user = await this.authAdapter.getUser();

    // Check if the token is expired or about to expire (within 5 minutes)
    const now = Date.now();
    const expiresAt = user.accessToken.expiresAt;
    const isExpired = expiresAt && expiresAt - now < 5 * 60 * 1000;

    if (!user.accessToken.value || isExpired) {
      // Token is missing or expired, refresh it
      await this.authAdapter.refreshToken();
      // Get the updated user info with the new token
      const updatedUser = await this.authAdapter.getUser();
      return updatedUser.accessToken.value;
    }

    return user.accessToken.value;
  }

  async refreshToken(): Promise<void> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.refreshToken();
  }

  async postCheckoutUrl(): Promise<string> {
    return this.authAdapter.postCheckoutUrl();
  }

  async startSignup(email: string | null): Promise<void> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.startSignup(email);
  }

  async startCheckout(): Promise<void> {
    await this.initPromise;
    this.ensureInitialized();
    await this.authAdapter.startCheckout();
  }

  async finishCheckout(request: Request): Promise<Response> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.finishCheckout(request);
  }

  async getAuthType(): Promise<string> {
    const authType = sessionStorage.getItem(this.AUTH_TYPE_KEY);
    //resolove the promise
    return this.initPromise.then(() => authType);
  }

  async getApiUrl(): Promise<string> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.getApiUrl();
  }

  async getMetricsUrl(): Promise<string> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.getMetricsUrl();
  }
}

export const authProvider: AuthProviderType = new AuthProvider();
