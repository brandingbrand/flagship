import { Cart } from './Cart';

/**
 * An interface that prescribes the options that can be passed into a data source's fetchCart
 * method.
 */
export interface CartQuery {
  /**
   * Whether to retrieve additional metadata about a cart. This may require making
   * additional requests beyond retrieving the cart itself. If true, no additional data
   * will be retrieved.
   */
  noExtraData?: boolean;

  /**
   * Whether to make new request if old data is available. If true, and the cart's data is
   * available, no additional requests will be made.
   */
  noNewRequest?: boolean;

  /**
   * The updated normalized cart to return in the `fetchCart` promise
   */
  updatedCart?: Cart;
}
