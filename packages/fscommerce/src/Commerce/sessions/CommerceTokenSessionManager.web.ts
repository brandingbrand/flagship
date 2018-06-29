import CommerceSessionManager, { CommerceSessionManagerOptions } from './CommerceSessionManager';
import { SessionToken } from '../types/SessionToken';

/**
 * Implementation of CommerceSessionManager token based authentication(jwt, oauth, etc.)
 */
export default class CommerceTokenSessionManager extends CommerceSessionManager {
  constructor(options: CommerceSessionManagerOptions) {
    super(options);
  }

  async delete(): Promise<boolean> {
    localStorage.removeItem(CommerceSessionManager.COMMERCE_TOKEN);
    return Promise.resolve(true);
  }

  // return current token
  async get(): Promise<SessionToken> {
    // load the token from local storage and store it in memory
    if (!this.token) {
      const tokenString = localStorage.getItem(
        CommerceSessionManager.COMMERCE_TOKEN
      ) || '';
      try {
        this.token = JSON.parse(tokenString);
        // JSON stringify/parse doesn't handle dates
        if (this.token) {
          this.token.expiresAt = new Date(this.token.expiresAt);
        }
      } catch (e) {
        console.log('invalid stored token', e);
        await this.delete();
      }
    }
    if (this.token && !this.isExpired(this.token)) {
      return this.token;
    } else if (this.token && this.isExpired(this.token)) {
      await this.delete();
    }
    const newToken = await this.options.createGuestToken();
    await this.set(newToken);
    return newToken;
  }
  // set the token
  async set(token: SessionToken): Promise<boolean> {
    this.token = token;
    localStorage.setItem(
      CommerceSessionManager.COMMERCE_TOKEN,
      JSON.stringify(token)
    );
    this.setupRefreshTimeout(token);
    return Promise.resolve(true);
  }

  async restore(): Promise<SessionToken> {
    // no extra steps to restore token, just return back currently stored token
    return this.get();
  }
}
