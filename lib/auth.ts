class AuthProvider {
  private readonly AUTH_TYPE_KEY = 'auth.type';
  private authAdapter: any;

  constructor() {
    this.initAuthClient();
  }

  private async initAuthClient(): Promise<void> {
    const authType = sessionStorage.getItem(this.AUTH_TYPE_KEY);

    if (authType === 'near') {
      // Near account based authentication to be done later
    } else if (authType === 'auth0' || !authType) {
      const { authAdapter: auth0Adapter } = await import('./plugins/auth0');
      this.authAdapter = auth0Adapter;
      if (!authType) {
        sessionStorage.setItem(this.AUTH_TYPE_KEY, 'auth0');
      }
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return this.authAdapter.isAuthenticated();
  }

  async startAuth(): Promise<void> {
    return this.authAdapter.startAuth();
  }

  async finishAuth(): Promise<void> {
    return this.authAdapter.finishAuth();
  }

  async logout(): Promise<void> {
    return this.authAdapter.logout();
  }

  async getUser(): Promise<any> {
    return this.authAdapter.getUser();
  }

  async refreshToken(): Promise<void> {
    return this.authAdapter.refreshToken();
  }

  async postCheckoutUrl(): Promise<string> {
    return this.authAdapter.postCheckoutUrl();
  }

  async startSignup(): Promise<void> {
    return this.authAdapter.startSignup();
  }

  async startCheckout(): Promise<void> {
    await this.authAdapter.startCheckout();
  }

  async finishCheckout(request: Request): Promise<Response> {
    return this.authAdapter.finishCheckout(request);
  }

  getAuthType(): string {
    return this.authAdapter.getAuthType();
  }
}

export const authProvider = new AuthProvider();
