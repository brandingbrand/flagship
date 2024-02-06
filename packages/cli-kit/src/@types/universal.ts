/**
 * Represents a URL scheme configuration with optional host information.
 * @example
 * const scheme: UrlScheme = {
 *   scheme: "https",
 *   host: "example.com"
 * };
 *
 * const scheme: UrlScheme = {
 *   scheme: "myapp"
 * }
 */
export type UrlScheme = {
  /** The URL scheme. */
  scheme: string;
  /** The optional host for the URL. */
  host?: string;
};
