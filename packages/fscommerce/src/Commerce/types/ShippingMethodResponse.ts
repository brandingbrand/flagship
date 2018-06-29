import { ShippingMethod } from './ShippingMethod';

/**
 * Interface representing the response when querying available shipping methods for an order.
 */
export interface ShippingMethodResponse {
  /**
   * An identifier corresponding to the shipping method that should be selected by default.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  defaultMethodId: string;

  /**
   * An array of all applicable shipping methods for an order.
   */
  shippingMethods: ShippingMethod[];
}
