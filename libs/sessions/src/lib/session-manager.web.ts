import { CommerceTypes } from '@brandingbrand/fscommerce';

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
  private getPromise?: Promise<CommerceTypes.SessionToken | null>;
  private token?: CommerceTypes.SessionToken;

  public async set(token: CommerceTypes.SessionToken): Promise<void> {
    this.token = token;
  }

  public async get(): Promise<CommerceTypes.SessionToken> {
    // allow no more than one invocation at a time
    // eslint-disable-next-line complexity
    this.getPromise = (this.getPromise ?? Promise.resolve()).then(async () => {
      let token: CommerceTypes.SessionToken | null | undefined = this.token;

      // we have expired token stored locally
      if (token && token.expiresAt < new Date()) {
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

    return this.getPromise as Promise<CommerceTypes.SessionToken>;
  }

  public async delete(): Promise<void> {}

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
    return document.cookie;
  }
}
