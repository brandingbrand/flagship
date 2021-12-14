import { Address } from './Address';

/**
 * Information about an address that is associated with a customer.
 */
export interface CustomerAddress extends Address {
  /**
   * Whether the address has been marked as a customer's preferred/primary address.
   */
  preferred: boolean;
}
