import { DemandwareBase } from './Base';
import {
  CartDataSource,
  CommerceTypes as FSCommerceTypes,
  runMiddleware
} from '@brandingbrand/fscommerce';
import demandwareDenormalizer from '../DemandwareDenormalizer';
import demandwareNormalizer from '../DemandwareNormalizer';
import { BasketWithProductDetails } from '../Types';

const kErrorMessageNoData = 'cannot get cart data';
const kHTTPHeaderMethodOverride = 'x-dw-http-method-override';

export class DemandwareCartDataSource extends DemandwareBase
                                      implements CartDataSource {
  /**
   * Apply a promo code to the current cart. Requires that a valid session token exist in
   * local storage.
   *
   * @param {string} promoCode - The promo code to be applied to the cart
   * @returns {Promise.<Cart>} A promise representing a normalized cart after the promotion
   * has been applied.
   */
  async applyPromo(promoCode: string): Promise<FSCommerceTypes.Cart> {
    const cartData = await this.fetchCart({ noExtraData: true });
    if (!cartData || !cartData.id) {
      throw new Error(kErrorMessageNoData);
    }

    const basketId = cartData.id;
    const { data } = await this.authRequest<SFCC.Basket>(
      'post',
      `/baskets/${encodeURIComponent(basketId)}/coupons`,
      {
        data: { code: promoCode }
      }
    );

    const products = await this.mutateCartDataWithProductDetail(data);
    (data as BasketWithProductDetails).product_details = products;

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data as BasketWithProductDetails,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Remove a promotion from the current cart as specified by its identifier.
   *
   * @param {string} promoItemId - An identifier corresponding to the promotion to be removed
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the promotion
   * has been removed.
   */
  async removePromo(promoItemId: string): Promise<FSCommerceTypes.Cart> {
    const cartData = await this.fetchCart({ noExtraData: true });
    if (!cartData || !cartData.id) {
      throw new Error(kErrorMessageNoData);
    }

    const basketId = cartData.id;
    const { data } = await this.authRequest<SFCC.Basket>(
      'delete',
      `/baskets/${encodeURIComponent(basketId)}/coupons/${promoItemId}`
    );
    const products = await this.mutateCartDataWithProductDetail(data);
    (data as BasketWithProductDetails).product_details = products;

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data as BasketWithProductDetails,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Update gift options for the current cart. Requires that a valid session token exist in
   * local storage.
   *
   * @param {GiftOptions} options - The updated gift options to be applied to the cart
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the gift
   * options have been updated
   */
  async updateGiftOptions(options: FSCommerceTypes.GiftOptions): Promise<FSCommerceTypes.Cart> {
    const url =
      `/baskets/${encodeURIComponent(options.cartId)}` +
      `/shipments/${encodeURIComponent(options.shipmentId)}`;
    const { data } = await this.authRequest<SFCC.Basket>('PATCH', url, {
      data: demandwareDenormalizer.giftOptions(options)
    });

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Update information regarding a specified order.
   *
   * @param {Order} order - The updated order object to be saved
   * @returns {Promise.<Order>} A Promise representing a normalized order object containing
   * the specified updates
   */
  async updateOrder(
    order: Partial<FSCommerceTypes.Order> & Pick<FSCommerceTypes.Order, 'orderId'>
  ): Promise<FSCommerceTypes.Order> {
    const denormalizedOrder = demandwareDenormalizer.updateOrder(order);
    if (denormalizedOrder === null) {
      throw new Error('Unable to update order');
    }

    const formData = await runMiddleware(
      order,
      denormalizedOrder,
      this.middleware.updateOrder
    );
    const url = `/orders/${encodeURIComponent(order.orderId)}`;
    const { data } = await this.authRequest<SFCC.Order>('PATCH', url, {
      data: formData
    });
    return runMiddleware(
      data,
      demandwareNormalizer.order(data, this.storeCurrencyCode),
      this.middleware.fetchOrder
    );
  }

  /**
   * Update payment information for a specified order.
   *
   * @param {string} orderId - An identifier corresponding to the order to be updated
   * @param {string} paymentId - An identifier corresponding to the specific payment to be updated
   * @param {Payment} payment - A payment object containing the updated information to be saved
   * @returns {Promise.<Order>} A Promise representing a normalized order after the payment has
   * been updated
   */
  async updateOrderPayment(
    orderId: string,
    paymentId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Order> {
    const denormalizedPayment = demandwareDenormalizer.payment(payment);
    if (denormalizedPayment === null) {
      throw new Error('Unable to update order payment');
    }

    const formData = await runMiddleware(
      payment,
      denormalizedPayment,
      this.middleware.updateOrderPayment
    );
    const url =
      `/orders/${encodeURIComponent(orderId)}` +
      `/payment_instruments/${encodeURIComponent(paymentId)}`;
    const { data } = await this.authRequest<SFCC.Order>('PATCH', url, { data: formData });

    return runMiddleware(
      data,
      demandwareNormalizer.order(data, this.storeCurrencyCode),
      this.middleware.fetchOrder
    );
  }

  /**
   * Submit an order corresponding to the specified cart. Requires that a valid session token
   * exist in local storage.
   *
   * @param {string} cartId - An identifier corresponding to the cart to be submitted
   * @returns {Promise.<Order>} A Promise representing metadata aout the order
   */
  async submitOrder(cartId: string): Promise<FSCommerceTypes.Order> {
    const { data } = await this.authRequest<SFCC.Order>('POST', '/orders', {
      data: { basket_id: cartId }
    });
    return demandwareNormalizer.order(data, this.storeCurrencyCode);
  }

  /**
   * Save a specified shipping method to the current cart. Requires that a valid session
   * token exist in local storage.
   *
   * @param {ShipmentMethodOptions} options - Metadata about a shipping method to be applied to
   * the cart
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the shipping method
   * has been applied.
   */
  async setShipmentMethod(
    options: FSCommerceTypes.ShipmentMethodOptions
  ): Promise<FSCommerceTypes.Cart> {
    const url =
      `/baskets/${encodeURIComponent(options.cartId)}` +
      `/shipments/${encodeURIComponent(options.shipmentId)}` +
      '/shipping_method';
    const { data } = await this.authRequest<SFCC.Basket>('POST', url, {
      headers: {
        [kHTTPHeaderMethodOverride]: 'PUT'
      },
      data: {
        id: options.methodId
      }
    });

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Add a product specified by id to the current user's cart. Requires that a valid session
   * token exist in local storage.
   *
   * @param {string} productId - An identifier corresponding to the product to be added to cart
   * @param {number} qty - The number of said product to be added to the cart
   * @param {Product} product - A product object representing the product to be added to the cart
   * @returns {Promise.<Cart>} A Promise representing a noramlized cart after the product
   * has been added.
   */
  async addToCart(
    productId: string,
    qty: number = 1,
    product?: FSCommerceTypes.Product
  ): Promise<FSCommerceTypes.Cart> {
    const cartData = await this.fetchCart({ noExtraData: true });
    if (!cartData || !cartData.id) {
      throw new Error(kErrorMessageNoData);
    }

    const basketId = cartData.id;
    const { data } = await this.authRequest<SFCC.Basket>(
      'post',
      `/baskets/${encodeURIComponent(basketId)}/items`,
      {
        data: [
          {
            product_id: productId,
            quantity: qty
          }
        ]
      }
    );

    const products = await this.mutateCartDataWithProductDetail(data);
    (data as BasketWithProductDetails).product_details = products;
    const normalizedCartData = demandwareNormalizer.cart(data, this.storeCurrencyCode);

    if (!normalizedCartData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data as BasketWithProductDetails,
      normalizedCartData,
      this.middleware.fetchCart
    );
  }

  /**
   * Set a shipping address on the current cart. Requires that a valid session token exist
   * in local storage.
   *
   * @param {ShipmentAddressOptions} options - Metadata about the shipping address to be saved
   * to the cart
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the shipping
   * address has been applied
   */
  async setShipmentAddress(
    options: FSCommerceTypes.ShipmentAddressOptions
  ): Promise<FSCommerceTypes.Cart> {
    // sets a shipment ship to address, to set to saved address use addressId option,
    //   otherwise use address option
    if (!options.address && !options.addressId) {
      throw new Error('Invalid Request: address or addressId is required.');
    }
    const url =
      `/baskets/${encodeURIComponent(options.cartId)}` +
      `/shipments/${encodeURIComponent(options.shipmentId)}` +
      '/shipping_address';
    const sameAsBilling = options.useAsBilling === undefined ? false : options.useAsBilling;
    const params: any = { use_as_billing: sameAsBilling };
    let formData = null;

    if (options.addressId) {
      params.customer_address_id = options.addressId;
    } else {
      const address = options.address as FSCommerceTypes.Address;
      const denormalizedAddress = demandwareDenormalizer.address(address);
      if (denormalizedAddress === null) {
        throw new Error('Unable to set address');
      }

      formData = await runMiddleware(
        address,
        denormalizedAddress,
        this.middleware.setShipmentAddress
      );
    }
    // put method not working so we need to use a override(may need to configure this some how)
    const { data } = await this.authRequest<SFCC.Basket>('POST', url, {
      headers: {
        [kHTTPHeaderMethodOverride]: 'PUT'
      },
      data: formData,
      params
    });

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Save customer information to the current cart. Requires that a valid session token
   * exist in local storage.
   *
   * @param {CustomerInfoOptions} options - Metadata about the customer to be saved to cart
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the customer
   * info has been applied
   */
  async setCustomerInfo(
    options: FSCommerceTypes.CustomerInfoOptions
  ): Promise<FSCommerceTypes.Cart> {
    if (!options.cartId && !options.email) {
      throw new Error('Invalid Request: cartId or email is required.');
    }

    const url = `/baskets/${encodeURIComponent(options.cartId)}/customer`;
    // put method not working so we need to use a override(may need to configure this some how)
    const { data } = await this.authRequest<SFCC.Basket>('POST', url, {
      headers: {
        [kHTTPHeaderMethodOverride]: 'PUT'
      },
      data: {
        email: options.email
      }
    });

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Set a billing address on the current cart. Requires that a valid session token exist
   * in local storage.
   *
   * @param {BillingAddressOptions} options - Metadata about the billing address to be saved
   * to the cart
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the billing
   * address has been applied
   */
  async setBillingAddress(
    options: FSCommerceTypes.BillingAddressOptions
  ): Promise<FSCommerceTypes.Cart> {
    // sets the billing address, to set to saved address use addressId option,
    //   otherwise use address option
    if (!options.address && !options.addressId) {
      throw new Error('Invalid Request: address or addressId is required.');
    }

    const url = `/baskets/${encodeURIComponent(options.cartId)}/billing_address`;
    const sameAsShipping = options.useAsShipping === undefined ? false : options.useAsShipping;
    const params: any = { use_as_shipping: sameAsShipping };
    let formData = null;

    if (options.addressId) {
      params.customer_address_id = options.addressId;
    } else {
      const address = options.address as FSCommerceTypes.Address;
      const denormalizedAddress = demandwareDenormalizer.address(address);
      if (denormalizedAddress === null) {
        throw new Error('Unable to set address');
      }

      formData = await runMiddleware(
        address,
        denormalizedAddress,
        this.middleware.setBillingAddress
      );
    }

    // put method not working so we need to use a override(may need to configure this some how)
    const { data } = await this.authRequest<SFCC.Basket>('POST', url, {
      headers: {
        [kHTTPHeaderMethodOverride]: 'PUT'
      },
      data: formData,
      params
    });

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Fetch shipping methods that can be applied to a specified shipment. Requires a valid session
   * token to exist in local storage.
   *
   * @param {string} cartId - An identifier corresponding to a cart for which shipping methods will
   * be returned
   * @param {string} shipmentId - An identifier corresponding to a shipment for which shipping
   * methods will be returned
   * @returns {Promise.<ShippingMethodResponse>} A Promise representing valid shipping methods for
   * the specified shipment
   */
  async fetchShippingMethods(
    cartId: string,
    shipmentId: string
  ): Promise<FSCommerceTypes.ShippingMethodResponse> {
    const url =
      `/baskets/${encodeURIComponent(cartId)}/` +
      `/shipments/${encodeURIComponent(shipmentId)}/` +
      'shipping_methods';

    const { data } = await this.authRequest<SFCC.ShippingMethodResult>('GET', url);

    const normalized = demandwareNormalizer.shippingMethodResponse(data, this.storeCurrencyCode);
    if (!normalized) {
      throw new Error('cannot get shipping method');
    }

    return runMiddleware(
      data,
      normalized,
      this.middleware.fetchShippingMethods
    );
  }

  /**
   * Fetch payment methods that can be applied to the current cart. Requires a valid
   * session token to exist in local storage.
   *
   * @param {string} cartId - An identifier corresponding to the cart for which applicable
   * payments should be returned
   * @returns {Promise.<Array.<ApplicablePayment>>} A Promise corresponding to an array of
   * applicable payments for the specified cart
   */
  async fetchPaymentMethods(cartId: string): Promise<FSCommerceTypes.ApplicablePayment[]> {
    const { data } = await this.authRequest<SFCC.PaymentMethodResult>(
      'GET',
      `/baskets/${encodeURIComponent(cartId)}/payment_methods`
    );
    return runMiddleware(
      data,
      demandwareNormalizer.applicablePayments(data),
      this.middleware.fetchPaymentMethods
    );
  }

  /**
   * Remove an item from a user's cart as specified by its id. Requires a valid session
   * token to exist in local storage.
   *
   * @param {string} itemId - An identifier corresponding to the cart item to be removed
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the item has
   * been removed
   */
  async removeCartItem(itemId: string): Promise<FSCommerceTypes.Cart> {
    const cartData = await this.fetchCart({ noExtraData: true });
    if (!cartData || !cartData.id) {
      throw new Error(kErrorMessageNoData);
    }

    const basketId = cartData.id;
    const { data } = await this.authRequest<SFCC.Basket>(
      'delete',
      `/baskets/${encodeURIComponent(basketId)}/items/${itemId}`
    );

    const products = await this.mutateCartDataWithProductDetail(data);
    (data as BasketWithProductDetails).product_details = products;
    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);

    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data as BasketWithProductDetails,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Update the quantity of a specified item in the user's cart. Requires a valid session
   * token to exist in local storage.
   *
   * @param {string} itemId - An identifier corresponding to a cart item to be updated
   * @param {number} qty - The adjusted quantity for the specified cart item
   * @returns {Promise.<Cart>} A Promise representing the normalized cart after the new
   * quantity has been applied
   */
  async updateCartItemQty(itemId: string, qty: number): Promise<FSCommerceTypes.Cart> {
    const cartData = await this.fetchCart({ noExtraData: true });
    if (!cartData || !cartData.id) {
      throw new Error(kErrorMessageNoData);
    }

    const basketId = cartData.id;
    const { data } = await this.authRequest<SFCC.Basket>(
      'patch',
      `/baskets/${encodeURIComponent(basketId)}/items/${itemId}`,
      { data: { quantity: qty } }
    );

    const products = await this.mutateCartDataWithProductDetail(data);
    (data as BasketWithProductDetails).product_details = products;
    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);

    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data as BasketWithProductDetails,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Destroy the current cart. Requires that a valid session token exist in local storage.
   *
   * @returns {Promise.<Object>} A Promise representing the response from the API. This data
   * is not normalized.
   */
  async destroyCart(): Promise<any> {
    const cartData = await this.fetchCart({ noExtraData: true });
    if (!cartData || !cartData.id) {
      return Promise.resolve();
    }
    return this.authRequest<void>('delete', `/baskets/${cartData.id}`);
  }

  /**
   * Fetch the cart for the current user. Requires that a valid session token exist in
   * local storage.
   *
   * @param {CartQuery} query - Options specifying how the cart should be retrieved
   * @returns {Promise.<Cart>} A Promise representing a normalized cart object
   */
  async fetchCart(query?: FSCommerceTypes.CartQuery): Promise<FSCommerceTypes.Cart> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(token.token.customer_id)}/baskets`;

    let cartData;
    const { data } = await this.authRequest<SFCC.BasketsResult>('get', url);

    if (data.baskets && data.baskets.length) {
      cartData = data.baskets[0];
    } else {
      const { data } = await this.authRequest<SFCC.Basket>('post', `/baskets`);
      cartData = data;
    }

    if (!query || !query.noExtraData) {
      const products = await this.mutateCartDataWithProductDetail(cartData);
      (cartData as BasketWithProductDetails).product_details = products;
    }

    const normalizedCartData = demandwareNormalizer.cart(cartData, this.storeCurrencyCode);
    if (!normalizedCartData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      cartData,
      normalizedCartData,
      this.middleware.fetchCart
    );
  }

  /**
   * Add a payment to a specified cart. Requires that a valid session token exist in local storage.
   *
   * @param {string} cartId - An identifier corresponding to the cart in which the payment should
   * be added
   * @param {Payment} payment - Metadata about the payment to be added to the cart
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the payment method
   * has been applied.
   */
  async addPayment(
    cartId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Cart> {
    const { data } = await this.authRequest<SFCC.Basket>(
      'POST',
      `/baskets/${encodeURIComponent(cartId)}/payment_instruments`,
      {
        data: demandwareDenormalizer.payment(payment)
      }
    );

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data,
      normalizedData,
      this.middleware.fetchCart
    );
  }

  /**
   * Update a specified payment record. Requires that a valid session token exist in local storage.
   *
   * @param {string} cartId - An identifier corresponding to a cart in which the specified payment
   * method should be updated
   * @param {string} paymentId - An identifier corresponding to the payment method to be updated
   * @param {Payment} payment - Updated information for the specified payment
   * @returns {Promise.<Cart>} A Promise representing a normalized cart after the specified payment
   * has been updated
   */
  async updatePayment(
    cartId: string,
    paymentId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Cart> {
    const url =
      `/baskets/${encodeURIComponent(cartId)}` +
      `/payment_instruments/${encodeURIComponent(paymentId)}`;
    const { data } = await this.authRequest<SFCC.Basket>('PATCH', url, {
      data: demandwareDenormalizer.payment(payment)
    });

    const normalizedData = demandwareNormalizer.cart(data, this.storeCurrencyCode);
    if (!normalizedData) {
      throw new Error(kErrorMessageNoData);
    }

    return runMiddleware(
      data,
      normalizedData,
      this.middleware.fetchCart
    );
  }

}
