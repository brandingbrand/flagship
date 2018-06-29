import { Address } from './Address';

/**
 * Object associating a billing address with a cart. (This is the billing address that will
 * be used for an order.)
 */
export interface BillingAddressOptions {
  /**
   * The identifier of an address.
   *
   * @example '1325134'
   */
  addressId?: string;

  /**
   * Metadata about an address to be used as the billing address.
   */
  address?: Address;

  /**
   * The cart identifier for which the specified address will be used as a billing address.
   *
   * @example '153141'
   */
  cartId: string;

  /**
   * Whether the specified address should also be used as the shipping address.
   */
  useAsShipping?: boolean;
}
