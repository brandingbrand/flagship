import CommerceSessionManager, { CommerceSessionManagerOptions } from './CommerceSessionManager';
import { SessionToken } from '../types/SessionToken';
// @ts-ignore: no type definition
import SInfo from 'react-native-sensitive-info';

/**
 * Implementation of CommerceSessionManager token based authentication(jwt, oauth, etc.)
 */
export default class CommerceTokenSessionManager extends CommerceSessionManager {
  options: CommerceSessionManagerOptions;

  constructor(options: CommerceSessionManagerOptions) {
    super(options);
    this.options = options;
  }

  async delete(): Promise<boolean> {
    await SInfo.deleteItem(CommerceSessionManager.COMMERCE_TOKEN, {});
    return true;
  }

  // return current token
  async get(): Promise<SessionToken> {
    // if we have a token in memory use it
    const token = this.token || (await this.getTokenFromLocalStorage());

    if (token && !this.isExpired(token)) {
      return token;
    } else {
      if (token && this.isExpired(token)) {
        await this.delete();
      }
      const newToken = await this.options.createGuestToken();
      await this.set(newToken);
      return newToken;
    }
  }

  async getTokenFromLocalStorage(): Promise<SessionToken> {
    return SInfo.getItem(CommerceSessionManager.COMMERCE_TOKEN, {})
      .then((tokenString: string) => {
        if (!tokenString) {
          throw new Error('missing token string');
        }
        try {
          this.token = JSON.parse(tokenString);
        } catch (e) {
          SInfo.deleteItem(CommerceSessionManager.COMMERCE_TOKEN, {}).catch(() => true);
          throw new Error('invalid stored token');
        }
        if (this.token) {
          // JSON stringify/parse doesn't handle dates
          this.token.expiresAt = new Date(this.token.expiresAt);
          return this.token;
        }
        throw new Error('missing token');
      })
      .catch(async (e: any) => {
        console.log('error with mobile storage', e);
        throw e;
      });
  }

  // set the token
  async set(token: SessionToken): Promise<boolean> {
    this.token = token;
    await SInfo.setItem(
      CommerceSessionManager.COMMERCE_TOKEN,
      JSON.stringify(token),
      {}
    );
    return true;
  }

  async restore(): Promise<SessionToken> {
    // no extra steps to restore token, just return back currently stored token
    return this.get();
  }

}
