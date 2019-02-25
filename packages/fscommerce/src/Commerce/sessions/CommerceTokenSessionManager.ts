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

  async getTokenFromLocalStorage(): Promise<SessionToken | null | undefined> {
    return SInfo.getItem(CommerceSessionManager.COMMERCE_TOKEN, {})
      .then((tokenString: string) => {
        if (!tokenString) {
          return null;
        }
        try {
          this.token = JSON.parse(tokenString);
          // JSON stringify/parse doesn't handle dates
          if (this.token) {
            this.token.expiresAt = new Date(this.token.expiresAt);
          }
          return this.token;
        } catch (e) {
          console.log('invalid stored token', e);
          SInfo.deleteItem(CommerceSessionManager.COMMERCE_TOKEN, {})
            .catch(e => console.warn('cannot delete token', e));
          return null;
        }
      })
      .catch(async (e: any) => {
        console.log('error with mobile storage', e);
        return Promise.resolve(null);
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
