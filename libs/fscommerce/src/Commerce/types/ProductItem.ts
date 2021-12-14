import { BaseGiftOptions } from './GiftOptions';
import { CartItem } from './Cart';

/**
 * Information about products that belong to an order.
 */
export interface ProductItem extends CartItem, BaseGiftOptions {
  /**
   * An identifier for the shipment in which the product is included.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  shipmentId?: string;

  /**
   * An identifier for the ShippingItem entry corresponding to this product. ShippingItem
   * provides information about a product to be shipped and its tax status.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  shippingItemId?: string;
}
