import { NetworkId } from '../mock-near-sdk-core/';
import { ICache, CacheKey, LocalStorageCache, InMemoryCache } from './cache';
import { credentialsFromWalletSelector, getWalletSelector as getWalletSelector } from './credentials';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { decodeJwt } from './jwt';

export class User {
  token: string;
  accountId: string;

  private constructor(token: string, accountId: string) {
    this.token = token;
    this.accountId = accountId;
  }

  public static fromToken(token: string | null): User | null {
    if (!token) {
      console.log('No token provided');
      return null;
    }
    try {
      const parsedToken = decodeJwt(token);
      return new User(token, parsedToken['customer']);
    } catch (e_) {
      const e = e_ as Error;
      console.log(`Invalid token: ${e.message}`);
      return null;
    }
  }
}

export interface NearAuthClientOptions {
  baseUrl: string;
  nearNetworkId: NetworkId;
}

export class NearAuthClient {
  private readonly baseUrl: string;
  private readonly nearNetworkId: NetworkId;
  private readonly cache: ICache;

  constructor(options: NearAuthClientOptions) {
    if (options.nearNetworkId === 'sandbox') throw new Error(`NEAR network not supported`);

    this.baseUrl = options.baseUrl;
    this.nearNetworkId = options.nearNetworkId;
    this.cache = typeof window === 'undefined' ? new InMemoryCache() : new LocalStorageCache();
  }

  async signupWithRedirect(email: string): Promise<void> {
    this.cache.set(CacheKey.EMAIL, email);
    this.authenticate();
  }

  async loginWithRedirect(): Promise<void> {
    this.cache.remove(CacheKey.EMAIL);
    this.authenticate();
  }

  async getUser(): Promise<User | undefined> {
    return this.cache.get(CacheKey.USER) as User;
  }

  private async authenticate(): Promise<void> {
    let contractId;

    if (this.nearNetworkId === 'mainnet') {
      contractId = 'near';
    } else if (this.nearNetworkId === 'testnet') {
      contractId = 'auth.onmachina.testnet';
    } else {
      throw new Error(`NEAR network ${this.nearNetworkId} not supported`);
    }

    const selector = await getWalletSelector(this.nearNetworkId);
    const modal = setupModal(selector, { contractId });

    modal.on('onHide', ({ hideReason }) => {
      if (hideReason === 'user-triggered') {
        // User closed the modal
        this.cache.remove(CacheKey.EMAIL);
      }
    });

    if (!selector.isSignedIn()) {
      modal.show();
      return;
    }

    // Authenticate immediately if NEAR account has already been chosen (no redirect).
    return this.handleRedirect(true);
  }

  async logout(): Promise<void> {
    this.cache.remove(CacheKey.USER);
    const selector = await getWalletSelector(this.nearNetworkId);
    const wallet = await selector.wallet();
    await wallet.signOut();
  }

  async isAuthenticated(): Promise<boolean> {
    return !!this.cache.get(CacheKey.USER);
  }

  async getTokenSilently(): Promise<any> {
    const user = this.cache.get(CacheKey.USER) as User;
    return user.token;
  }

  /**
   * Handles a possible redirect to continue authentication
   * after the NEAR Wallet Selector or Stripe checkout session.
   *
   * @param afterWalletRedirect - Wallet selection redirect result.
   * @param stripeSessionId - Stripe session ID for the user after a successful checkout.
   * @returns A promise that resolves to void.
   */
  async handleRedirect(afterWalletRedirect: boolean, stripeSessionId?: string): Promise<void> {
    // Guard to avoid triggering without a real redirect which would come
    // from either the Wallet Selector or Stripe.
    if (!afterWalletRedirect && !stripeSessionId) {
      return;
    }

    // It's gonna happen only once after the Wallet Selector redirect, or
    // when the wallet already selected.
    const email = this.cache.remove(CacheKey.EMAIL);

    console.log(`Retrieved email from cache: ${email}`);

    const credentials = await credentialsFromWalletSelector(this.nearNetworkId, email);

    let params = '';
    if (stripeSessionId) {
      params = '?' + new URLSearchParams({ session_id: stripeSessionId }).toString();
    }

    const response = await fetch(`${this.baseUrl}${params}`, {
      headers: {
        'x-auth-user': 'any',
        'x-auth-key': credentials,
      },
    });

    if (response.redirected && typeof window !== 'undefined') {
      window.location.assign(response.url);
    } else if (response.ok) {
      const user = User.fromToken(response.headers.get('x-auth-token'));
      if (!user) {
        return;
      }
      this.cache.set(CacheKey.USER, user);
    }
  }
}
