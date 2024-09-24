/* all auth adapters (plugins) should implement this interface */
export interface AuthAdapter {
  isAuthenticated(): Promise<boolean>;
  startLogin(): Promise<void>;
  finishAuth(request: Request): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  refreshToken(): Promise<void>;
  startSignup(email: string | null): Promise<void>;
  startCheckout(request: Request): Promise<string | null>;
  finishCheckout(request: Request): Promise<any>;
  handleCustomRedirect(request: Request): Promise<boolean>;
  getAuthType(): string;
  getApiUrl(): string;
  getMetricsUrl(): string;
}
interface AuthProviderType {
  isAuthenticated(): Promise<boolean>;
  startLogin(): Promise<void>;
  finishAuth(request: Request): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  refreshToken(): Promise<void>;
  accessToken(): Promise<string>;
  startSignup(email: string | null): Promise<void>;
  startCheckout(request: Request): Promise<string | null>;
  finishCheckout(request: Request): Promise<Response | null>;
  handleCustomRedirect(request: Request): Promise<boolean>;
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

  constructor() {}

  private async initAuthClient(): Promise<void> {
    const authType = sessionStorage.getItem(this.AUTH_TYPE_KEY);

    if (authType === 'near') {
      const { authAdapter: nearAdapter } = await import('./plugins/near');
      this.authAdapter = nearAdapter;
    } else if (authType === 'auth0') {
      const { authAdapter: auth0Adapter } = await import('./plugins/auth0');
      this.authAdapter = auth0Adapter;
    }
  }

  private ensureInitialized(): void {
    if (!this.authAdapter) {
      throw new Error('AuthProvider not initialized');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    await this.initAuthClient();
    if (!this.authAdapter) {
      return false;
    }
    return this.authAdapter.isAuthenticated();
  }

  async startLogin(): Promise<void> {
    await this.initAuthClient();
    this.ensureInitialized();
    await this.authAdapter.startLogin();
    console.log('HASNT AWAITED START LOGIN');
  }

  async finishAuth(request: Request): Promise<void> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.finishAuth(request);
  }

  async logout(): Promise<void> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.logout();
  }

  async getUser(): Promise<User> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.getUser() as Promise<User>;
  }

  async accessToken(): Promise<string> {
    await this.initAuthClient();
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
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.refreshToken();
  }

  async startSignup(email: string | null): Promise<void> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.startSignup(email);
  }

  async startCheckout(request: Request): Promise<string | null> {
    await this.initAuthClient();
    this.ensureInitialized();
    return await this.authAdapter.startCheckout(request);
  }

  async finishCheckout(request: Request): Promise<Response> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.finishCheckout(request);
  }

  async handleCustomRedirect(request: Request): Promise<boolean> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.handleCustomRedirect(request);
  }

  async getAuthType(): Promise<string> {
    const authType = sessionStorage.getItem(this.AUTH_TYPE_KEY);
    await this.initAuthClient();
    return authType;
  }

  async getApiUrl(): Promise<string> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.getApiUrl();
  }

  async getMetricsUrl(): Promise<string> {
    await this.initAuthClient();
    this.ensureInitialized();
    return this.authAdapter.getMetricsUrl();
  }
}

export const authProvider: AuthProviderType = new AuthProvider();
