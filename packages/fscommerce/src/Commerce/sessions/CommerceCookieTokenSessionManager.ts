import CommerceSessionManager, {
  CommerceSessionManagerOptions
} from './CommerceSessionManager';
import { SessionToken } from '../types/SessionToken';
import { Platform } from 'react-native';
// @ts-ignore: no type definition
import SInfo from 'react-native-sensitive-info';
// @ts-ignore: no type definition
import CookieManager from 'react-native-cookies';

/**
 * Implementation of session manager for cookie based authentication
 * WARNING: this implementation has not been fully tested and needs more to confirm
 */
export default class CommerceCookieTokenSessionManager extends CommerceSessionManager {
  constructor(options: CommerceSessionManagerOptions) {
    super(options);
  }

  async delete(): Promise<boolean> {
    await SInfo.deleteItem(CommerceSessionManager.COMMERCE_TOKEN, {});
    return true;
  }

  // return current token
  async get(): Promise<SessionToken> {
    // if we have a token in memory use it
    if (this.token) {
      return Promise.resolve(this.token);
    }
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
      .catch(e => {
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
    this.setupRefreshTimeout(token);
    return true;
  }

  async restore(): Promise<SessionToken> {
    const token = await this.get();
    CookieManager.setFromResponse(
      token.token.url,
      Platform.OS === 'ios'
        ? { 'Set-Cookie': token.token.cookie }
        : token.token.cookie
    )
      .then(() => true)
      .catch(() => true);
    return token;
  }
}
