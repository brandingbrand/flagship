import type {
  ApplicablePayment,
  BillingAddressOptions,
  Cart,
  CartQuery,
  CustomerInfoOptions,
  GiftOptions,
  Order,
  Payment,
  Product,
  ShipmentAddressOptions,
  ShipmentMethodOptions,
  ShippingMethodResponse,
} from '../CommerceTypes';

/**
 * Methods to interact with a cart from a data source.
 */
export default interface CartDataSource {
  /**
   * Add a specified item to cart by means of either a productId or product instance.
   *
   * @param productId - The ID of the product to add to cart
   * @param qty - The quantity of product to add to cart
   * @param product - A product instance to be added to cart
   * @return A Promise representing metadata about the active cart
   */
  addToCart: (productId: string, qty?: number, product?: Product) => Promise<any>;

  /**
   * Add a payment instance to a specified cart.
   *
   * @param cartId - The id of the cart in which the payment will be added
   * @param payment - The payment instance to be added to the cart
   * @return A Promise representing cart metadata
   */
  addPayment: (cartId: string, payment: Payment) => Promise<Cart>;

  /**
   * Fetch a cart instance matching a cart query.
   *
   * @param query - The query by which a matching cart will be returned
   * @return A Promise representing cart metadata
   */
  fetchCart: (query?: CartQuery) => Promise<Cart>;

  /**
   * Destroy the current cart.
   */
  destroyCart: () => Promise<void>;

  /**
   * Fetch applicable payment methods for a specified cart.
   *
   * @param cartId - The identifier for the cart for which payments will be queried.
   * @return A Promise representing applicable payments
   */
  fetchPaymentMethods: (cartId: string) => Promise<ApplicablePayment[]>;

  /**
   * Fetch applicable shipping methods for a specified cart and shipment.
   *
   * @param cartId - The id of the cart for which to query shipping methods
   * @param shipmentId - The id of the shipment for which to query shipping methods
   * @return Promise representing applicable shipping methods
   */
  fetchShippingMethods: (cartId: string, shipmentId: string) => Promise<ShippingMethodResponse>;

  /**
   * Remove an item from the cart specified by item id.
   *
   * @param itemId - The identifier of the cart item to be removed
   * @return A Promise representing metadata about the active cart
   */
  removeCartItem: (itemId: string) => Promise<Cart>;

  /**
   * Set a billing address to the active cart.
   *
   * @param options - Address metadata to be saved to the cart
   * @return A Promise representing metadata about the active cart
   */
  setBillingAddress: (options: BillingAddressOptions) => Promise<Cart>;

  /**
   * Set customer information to the active cart.
   *
   * @param options - Customer metadata to be saved to the cart
   * @return A Promise representing metadata about the active cart
   */
  setCustomerInfo: (options: CustomerInfoOptions) => Promise<Cart>;

  /**
   * Set a shipment address on the active cart.
   *
   * @param options - Address metadata to be saved to the cart
   * @return A Promise representing metadata about the active cart
   */
  setShipmentAddress: (options: ShipmentAddressOptions) => Promise<Cart>;

  /**
   * Set a shipment method for the active cart.
   *
   * @param options - Shipping method metadata to be saved to the cart
   * @return A Promise representing metadata about the active cart
   */
  setShipmentMethod: (options: ShipmentMethodOptions) => Promise<Cart>;

  /**
   * Submit an order specified by a cart id.
   *
   * @param cartId - The identifier of the cart to be submitted
   * @return A Promise representing metadata about the submitted order
   */
  submitOrder: (cartId: string) => Promise<Order>;

  /**
   * Update a specified order.
   *
   * @param order - The order to be updated
   * @return A Promise representing metadata about the updated order
   */
  updateOrder: (order: Order) => Promise<Order>;

  /**
   * Update an order specified by an id with a provided payment instance
   *
   * @param orderId - The id of an order for which the payment will be updated
   * @param paymentId - The id of a payment for which the order will be updated
   * @param payment - Metadata about a payment which will be updated on an order
   * @return A Promise representing metadata about the updated order
   */
  updateOrderPayment: (orderId: string, paymentId: string, payment: Payment) => Promise<Order>;

  /**
   * Update the quantity of a selected cart item in the current cart.
   *
   * @param itemId - The id of a cart item for which the quantity will be updated
   * @param qty - The updated quantity of the cart item
   * @return A Promise representing metadata about the updated cart
   */
  updateCartItemQty: (itemId: string, qty: number) => Promise<Cart>;

  /**
   * Update the payment for a specified cart
   *
   * @param cartId - The id of the cart for which the payment will be updated
   * @param paymentId - The id of the cart payment to be updated
   * @param payment - Metadata about the payment to be updated
   * @return A Promise representing metadata about the updated cart
   */
  updatePayment: (cartId: string, paymentId: string, payment: Payment) => Promise<Cart>;

  /**
   * Update the gift options on the current cart
   *
   * @param giftOptions - Metadata about gift options to be updated
   * @return A Promise representing metadata about the updated cart
   */
  updateGiftOptions: (giftOptions: GiftOptions) => Promise<Cart>;

  /**
   * Apply a promo code to the current cart
   *
   * @param promoCode - The promo to be applied
   * @return A Promise representing metadata about the updated cart
   */
  applyPromo: (promoCode: string) => Promise<Cart>;

  /**
   * Remove a promo code item from the current cart
   *
   * @param promoItemId - The id of the promo code item to be removed
   * @return A Promise representing metadata about the updated cart
   */
  removePromo: (promoItemId: string) => Promise<Cart>;

  /**
   * Requests missing detailed info for the products in the cart
   *
   * @param cartData - raw cart data from the datasource, may contain previously requested
   *   detailed info for the products in the cart
   * @return A Promise representing products with detailed info
   */
  mutateCartDataWithProductDetail?: <T>(cartData: T) => Promise<Product[]>;
}
