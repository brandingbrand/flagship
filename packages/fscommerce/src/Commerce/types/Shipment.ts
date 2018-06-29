import { Address } from './Address';
import { BaseGiftOptions } from './GiftOptions';
import { ShippingMethod } from './ShippingMethod';

/**
 * Information about a shipment, which represents a single package shipped as part of an order.
 */
export interface Shipment extends BaseGiftOptions {
  /**
   * The address of the recipient of the shipment.
   */
  address: Address;

  /**
   * A unique identifier for the shipment.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  id: string;

  /**
   * The sequence number of the shipment in relation to the order.
   *
   * @example '1'
   */
  shipmentNumber?: string;

  /**
   * Information about the shipping method selected for the shipment.
   */
  shippingMethod: ShippingMethod;
}
