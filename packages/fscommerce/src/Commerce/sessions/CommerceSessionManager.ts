import { SessionToken } from '../types/SessionToken';

export interface CommerceSessionManagerOptions {
  refreshToken: (token: SessionToken) => Promise<SessionToken>;
  createGuestToken: () => Promise<SessionToken>;
  createLoginToken: (
    username: string,
    password: string
  ) => Promise<SessionToken>;
  destroyToken: () => Promise<any>;
}

/**
 * Base class for handling session based authentication
 */
export default abstract class CommerceSessionManager {
  static COMMERCE_TOKEN: string = 'COMMERCE_TOKEN';
  refreshTimeout: any = null;
  options: CommerceSessionManagerOptions;
  token?: SessionToken;

  constructor(options: CommerceSessionManagerOptions) {
    this.options = options;
  }
  // remove the token from storage
  abstract delete(): Promise<boolean>;
  // return current token
  abstract get(): Promise<SessionToken | null | undefined>;
  // set the token
  abstract set(token: SessionToken): Promise<boolean>;
  // restore token on app launch
  abstract restore(): Promise<SessionToken | null>;

  isExpired(token: SessionToken): boolean {
    return token.expiresAt < new Date();
  }

  async login({
    username,
    password
  }: {
    username: string;
    password: string;
  }): Promise<SessionToken> {
    const token = await this.options.createLoginToken(username, password);
    await this.set(token);
    return token;
  }

  async logout(): Promise<any> {
    const response = await this.options.destroyToken();
    await this.delete();
    return response;
  }

  setupRefreshTimeout(token: SessionToken): void {
    // handle setting timeout to refresh the token
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    // refresh one minute before expiration
    const refreshMilliseconds = token.expiresAt.getTime() - Date.now() - 6000;
    if (refreshMilliseconds > 0) {
      this.refreshTimeout = setTimeout(() => {
        this.refreshTimeout = null;
        this.get()
          .then(async token => {
            if (!token) {
              return Promise.reject(new Error('token is null'));
            }

            return this.options.refreshToken(token);
          })
          .then(async newToken => this.set(newToken))
          .catch(e => console.log('unable to refresh token:', e));
      }, refreshMilliseconds);
    }
  }
}
