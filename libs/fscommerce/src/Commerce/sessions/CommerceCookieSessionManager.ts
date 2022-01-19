import CommerceSessionManager from './CommerceSessionManager';
import { SessionToken } from '../types/SessionToken';

// @ts-ignore
import * as CookieManager from 'react-native-cookies';

/**
 * Implementation of CommerceSessionManager token based authentication(jwt, oauth, etc.)
 */
export default class CommerceCookieSessionManager extends CommerceSessionManager {
  options: any;

  constructor(options: any) {
    super(options);
    this.options = options;
  }

  async delete(): Promise<boolean> {
    CookieManager.clearAll();
    return true;
  }

  async get(): Promise<SessionToken> {
    let token: SessionToken | null = null;

    try {
      token = await this.options.sessionCookiesToToken();
    } catch (e) {
      /* let it fail sliently */
    }

    if (token) {
      return token;
    }

    if (this.options.restoreCookies) {
      try {
        await this.options.restoreCookies();
        token = await this.options.sessionCookiesToToken();
      } catch (e) {
        /* let it fail sliently */
      }

      if (token) {
        return token;
      }
    }

    return this.options.createGuestToken();
  }

  async set(token: SessionToken): Promise<boolean> {
    return true;
  }

  async restore(): Promise<SessionToken> {
    return this.get();
  }
}
