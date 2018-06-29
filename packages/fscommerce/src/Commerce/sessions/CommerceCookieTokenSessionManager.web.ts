import CommerceSessionManager, {
  CommerceSessionManagerOptions
} from './CommerceSessionManager';
import { SessionToken } from '../types/SessionToken';

const WebDummySessionToken: SessionToken = {
  token: true,
  expiresAt: new Date(2499, 1, 1)
};

/**
 * Implementation of session manager for cookie based authentication
 * WARNING: this implementation has not been fully tested and needs more to confirm
 */
export default class CommerceCookieTokenSessionManager extends CommerceSessionManager {
  constructor(options: CommerceSessionManagerOptions) {
    super(options);
  }

  async delete(): Promise<boolean> {
    return Promise.resolve(true);
  }

  // return current token
  async get(): Promise<SessionToken> {
    // if we have a token in memory use it
    if (this.token) {
      return Promise.resolve(this.token);
    }
    // we don't have anything to do on web since cookies are handled by browser
    this.token = WebDummySessionToken;
    return Promise.resolve(this.token);
  }
  // set the token
  async set(token: SessionToken): Promise<boolean> {
    this.token = token;
    this.setupRefreshTimeout(token);
    return Promise.resolve(true);
  }

  async restore(): Promise<SessionToken> {
    return this.get();
  }
}
