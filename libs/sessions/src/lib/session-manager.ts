import { CommerceTypes } from '@brandingbrand/fscommerce';

// @ts-ignore No types for react-native-cookies
import * as CookieManager from 'react-native-cookies';
import * as SInfo from 'react-native-sensitive-info';

const SESSION_MANAGER_TOKEN = 'session-manager-token';

const sensitiveInfoOptions: SInfo.RNSensitiveInfoOptions = {
  sharedPreferencesName: 'Ecommerce-Prefs',
  keychainService: 'Ecommerce-Service',
};

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

  public async set(token: CommerceTypes.SessionToken): Promise<void> {
    const tokenStringify = JSON.stringify(token);
    await SInfo.setItem(SESSION_MANAGER_TOKEN, tokenStringify, sensitiveInfoOptions).catch((err) =>
      console.log(err)
    );
  }

  public async get(): Promise<CommerceTypes.SessionToken> {
    try {
      const tokenString: string = await SInfo.getItem(SESSION_MANAGER_TOKEN, sensitiveInfoOptions);
      const token = JSON.parse(tokenString);
      if (token) {
        return token;
      }
    } catch (e) {
      /* let it fail sliently */
    }

    try {
      const token = await this.options.sessionCookiesToToken();
      if (token) {
        return token;
      }
    } catch (e) {
      /* let it fail sliently */
    }

    if (this.options.restoreCookies) {
      try {
        await this.options.restoreCookies();
        const token = await this.options.sessionCookiesToToken();
        if (token) {
          return token;
        }
      } catch (e) {
        /* let it fail sliently */
      }
    }

    return this.options.createGuestToken();
  }

  public async delete(): Promise<void> {
    await SInfo.deleteItem(SESSION_MANAGER_TOKEN, sensitiveInfoOptions);
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
