/**
 * Type that associates a user's email with a cart.
 */
export interface CustomerInfoOptions {
  /**
   * A unique identifier for a cart.
   *
   * @example '5134131'
   */
  cartId: string;

  /**
   * The user's email address.
   *
   * @example 'test@example.com'
   */
  email: string;
}
