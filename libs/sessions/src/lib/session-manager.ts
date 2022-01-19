import { CommerceTypes } from '@brandingbrand/fscommerce';

// @ts-ignore No types for react-native-cookies
import * as CookieManager from 'react-native-cookies';

export interface SessionManagerOptions {
  refreshToken: (token: CommerceTypes.SessionToken) => Promise<CommerceTypes.SessionToken>;
  createGuestToken: (token?: CommerceTypes.SessionToken) => Promise<CommerceTypes.SessionToken>;
  createLoginToken: (username: string, password: string) => Promise<CommerceTypes.SessionToken>;
  destroyToken: () => Promise<void>;
  sessionCookiesToToken: () => Promise<CommerceTypes.SessionToken | null>;
  restoreCookies?: () => Promise<void>;
}

export class SessionManager {
  constructor(private readonly options: SessionManagerOptions) {}

  public async set(_token: CommerceTypes.SessionToken): Promise<void> {}

  public async get(): Promise<CommerceTypes.SessionToken> {
    let token: CommerceTypes.SessionToken | null = null;

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

  public async delete(): Promise<void> {
    CookieManager.clearAll();
  }

  public async login(username: string, password: string): Promise<CommerceTypes.SessionToken> {
    const token = await this.options.createLoginToken(username, password);
    await this.set(token);
    return token;
  }

  public async logout(): Promise<void> {
    await this.options.destroyToken();
    await this.delete();
  }

  public async getCookies(): Promise<string | null> {
    return null;
  }
}
