/**
 * Interface specifying the options that are available when performing a login operation
 * through a specified data source.
 */
export interface LoginOptions {
  /**
   * Whether the user's current cart should be merged with the cart from their previous
   * authenticated session.
   */
  shouldMergeCart?: boolean;
}
