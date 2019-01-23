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
  async get(): Promise<SessionToken | null | undefined> {
    // if we have a token in memory use it
    if (this.token) {
      return Promise.resolve(this.token);
    }
    return SInfo.getItem(CommerceSessionManager.COMMERCE_TOKEN, {})
      .then((tokenString: string) => {
        if (!tokenString) {
          return Promise.resolve(null);
        }
        try {
          this.token = JSON.parse(tokenString);
          // JSON stringify/parse doesn't handle dates
          if (this.token) {
            this.token.expiresAt = new Date(this.token.expiresAt);
          }
          return Promise.resolve(this.token);
        } catch (e) {
          console.log('invalid stored token', e);
          SInfo.deleteItem(CommerceSessionManager.COMMERCE_TOKEN, {})
            .catch(e => console.warn('cannot delete token', e));
          return Promise.resolve(null);
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
    this.setupRefreshTimeout(token);
    return true;
  }

  async restore(): Promise<SessionToken | null> {
    const token = await this.get();

    if (!token) {
      return null;
    }

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
