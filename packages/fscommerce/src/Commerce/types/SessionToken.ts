/**
 * Metadata about a session token that is used to verify a user's authentication status.
 */
export interface SessionToken {
  /**
   * An OAuth token granting access to a privileged application. Note that OAuth does not specify
   * the format of a token, making it application-specific.
   */
  token: any;

  /**
   * The date and time at which the token will expire. This value should be able to be parsed
   * into a JavaScript Date object.
   *
   * @example '2018-04-11T15:06:11.000Z'
   */
  expiresAt: Date;
}
