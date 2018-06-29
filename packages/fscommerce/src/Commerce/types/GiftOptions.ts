/**
 * Encapsulation of common fields that indicate the gift status of products.
 */
export interface BaseGiftOptions {
  /**
   * Whether the specified shipment is a gift.
   */
  gift: boolean;

  /**
   * A gift message to be provided alongside the shipment in question.
   */
  giftMessage?: string;
}

/**
 * Interface that indicates that a specific shipment from a cart is a gift.
 */
export interface GiftOptions extends BaseGiftOptions {
  /**
   * A unique identifier for a cart which contains the shipment to be marked as a gift.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  cartId: string;

  /**
   * A unique identifier for the shipment that is to be treated as a gift. Shipments are
   * typically the individual packages that comprise a customer's order.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  shipmentId: string;
}
