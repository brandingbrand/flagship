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
  noExtraData: boolean;
}
