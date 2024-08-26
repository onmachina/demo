interface AuthAdapter {
  isAuthenticated(): Promise<boolean>;
  startAuth(): Promise<void>;
  finishAuth(request: Request): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  refreshToken(): Promise<void>;
  postCheckoutUrl(): Promise<string>;
  startSignup(): Promise<void>;
  startCheckout(): Promise<void>;
  finishCheckout(request: Request): Promise<any>;
  getAuthType(): Promise<string>;
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
  private readonly AUTH_TYPE_KEY = 'auth.type';
  private authAdapter: AuthAdapter | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initAuthClient();
  }

  private async initAuthClient(): Promise<void> {
    const authType = sessionStorage.getItem(this.AUTH_TYPE_KEY);

    const { authAdapter: NearAuthAdapter } = await import('./plugins/near');
    this.authAdapter = NearAuthAdapter;

    // if (authType === 'near') {
    //   // Near account based authentication to be done later
    // } else if (authType === 'auth0' || !authType) {
    //   const { authAdapter: auth0Adapter } = await import('./plugins/auth0');
    //   this.authAdapter = auth0Adapter;
    //   if (!authType) {
    //     sessionStorage.setItem(this.AUTH_TYPE_KEY, 'auth0');
    //   }
    // }
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

  async startSignup(): Promise<void> {
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.startSignup();
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
    await this.initPromise;
    this.ensureInitialized();
    return this.authAdapter.getAuthType();
  }
}

export const authProvider = new AuthProvider();
