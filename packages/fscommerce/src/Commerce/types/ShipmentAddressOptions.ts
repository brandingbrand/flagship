import { Address } from './Address';

/**
 * Interface that prescribes options that can be provided to the commerce source method to
 * set address options on a shipment.
 */
export interface ShipmentAddressOptions {
  /**
   * An identifier corresponding to an address to be associated with a shipment.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  addressId?: string;

  /**
   * Line-item information about an address to be associated with a shipment.
   */
  address?: Address;

  /**
   * An identifier corresponding to the cart in which the shipment is contained.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  cartId: string;

  /**
   * An identifier corresponding to the shipment in which the address should be associated.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  shipmentId: string;

  /**
   * Whether the specified address should be used as the billing address for the shipment.
   */
  useAsBilling?: boolean;
}
