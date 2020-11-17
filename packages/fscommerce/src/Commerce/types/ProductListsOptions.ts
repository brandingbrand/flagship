/**
 * Interface that prescribes options that can be provided to the commerce source method to
 * get product lists for the customer.
 */
export interface ProductListsOptions {
  /**
   * The count returned per page. Integer. Minimum is 1. Maximum is 200.
   *
   * @example 1
   */
  count?: number;

  /**
   * The possible expansions - product, images, availability. For images and availability
   * the product has to be expanded as well.
   *
   * @example 'product,images,availability'
   */
  expand?: string;

  /**
   * The start of the product List. Integer. Minimum is 0.
   *
   * @example 0
   */
  start?: number;
}
