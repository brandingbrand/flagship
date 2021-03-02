import CommerceSessionManager, { CommerceSessionManagerOptions } from './CommerceSessionManager';
import { SessionToken } from '../types/SessionToken';

export interface CommerceCookieSessionManagerOptions extends CommerceSessionManagerOptions {
  sessionCookiesToToken: () => Promise<SessionToken | null>;
  restoreCookies?: () => Promise<void>;
}

/**
 * Implementation of CommerceSessionManager token based authentication(jwt, oauth, etc.)
 */
export default class CommerceCookieSessionManager extends CommerceSessionManager {
  options: CommerceCookieSessionManagerOptions;
  getPromise!: Promise<SessionToken | null>;

  constructor(options: CommerceCookieSessionManagerOptions) {
    super(options);
    this.options = options;
  }

  async delete(): Promise<boolean> {
    return true;
  }

  /**
   * Provides cookies to decide if the session can be converted to JWT
   *
   * @returns {Promise.<string | null>} A Promise representing cookies string
   */
  async getCookies(): Promise<string | null> {
    return document.cookie;
  }

  /**
   * Returns current token for the session.
   *
   * Only one invocation at a time is allowed. If it's called again
   * it will have to wait until the previous invocation is complete.
   *
   * The token is cached locally and re-used until it expires.
   *
   * The token is refreshed automatically upon expiration if `refreshToken` method was provided.
   *
   * If no token exist it will attempt to convert current session into JWT.
   *
   * If we could not convert current session, it will create new token for the guest user.
   *
   * @returns {Promise.<SessionToken | null>} A Promise representing token
   */
  // tslint:disable:cyclomatic-complexity
  async get(): Promise<SessionToken | null> {
    // allow no more than one invocation at a time
    this.getPromise = (this.getPromise || Promise.resolve()).then(async () => {
      let token: SessionToken | null | undefined = this.token;

      // we have expired token stored locally
      if (token && this.isExpired(token)) {
        // refresh it
        token = await this.options.refreshToken(token);

        // got new token - store it
        if (token) {
          await this.set(token);
        }
      }

      // got old token
      if (token) {
        return token;
      }

      // no token - get a token from the session
      try {
        token = await this.options.sessionCookiesToToken();
      } catch (e) {
        /* let it fail sliently */
      }

      // got a token - store it
      if (token) {
        await this.set(token);

        return token;
      }

      // no token - try to restore the cookie and the a token from the session
      if (this.options.restoreCookies) {
        try {
          await this.options.restoreCookies();
          token = await this.options.sessionCookiesToToken();
        } catch (e) {
          /* let it fail sliently */
        }
      }

      // got a token - store it
      if (token) {
        await this.set(token);

        return token;
      }

      // no token - try to create new guest token
      token = await this.options.createGuestToken();

      // got a token - store it
      if (token) {
        await this.set(token);

        return token;
      }

      // no token
      return null;
    });

    return this.getPromise;
  }

  async set(token: SessionToken): Promise<boolean> {
    this.token = token;

    return true;
  }

  async restore(): Promise<SessionToken | null> {
    return this.get();
  }
}
