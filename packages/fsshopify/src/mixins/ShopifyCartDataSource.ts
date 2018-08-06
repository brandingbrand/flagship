import {
  CartDataSource,
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import DataSourceBase from '../util/DataSourceBase';
import * as ShopifyTypes from '../customTypes';
import {
  CheckoutResponse,
  ShopifyLineItem,
  ShopifyTokenizedPayment
} from '../util/ShopifyResponseTypes';
import * as Normalizers from '../normalizers';
import ShopifyAPIError from '../util/ShopifyAPIError';
import {
  PaymentDetailsInit,
  PaymentMethodData,
  PaymentOptions,
  PaymentRequest
} from '../util/react-native-payments';
import { Platform } from 'react-native';
import FSNetwork from '@brandingbrand/fsnetwork';
import { Navigator } from 'react-native-navigation';

const kErrorMessageNotImplemented = 'not implemented';

export class ShopifyCartDataSource extends DataSourceBase
                                   implements CartDataSource {

  async addToCart(
    variantId: string,
    qty?: number,
    product?: FSCommerceTypes.Product
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    if (!product || !product.id) {
      throw new ShopifyAPIError('Pass the parent product id in the third argument to addToCart');
    }

    // store productId because we will only have variantId from the cart
    const customAttributes = [
      {
        key: 'productId',
        value: product.id
      }
    ];

    // start a cart/checkout session for storing the item
    const checkoutId = await this.getOrStartCart();

    const cart = await this.api.checkoutLineItemsAdd(checkoutId, variantId, qty, customAttributes);
    return Normalizers.cart(cart, this.config.storeCurrencyCode);
  }

  async fetchCart(
    query?: ShopifyTypes.ShopifyCartQuery
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    if (query && query.cartId) {
      this.cartId = query.cartId;
    }
    const checkoutId = await this.getOrStartCart();
    const shopifyCheckout = await this.api.getCheckout(checkoutId);

    const d = Normalizers.cart(shopifyCheckout, this.config.storeCurrencyCode);
    d.shopifyCheckout = shopifyCheckout;

    return d;
  }

  async removeCartItem(
    itemId: string
  ): Promise<FSCommerceTypes.Cart> {
    const checkoutId = await this.getOrStartCart();
    const response = await this.api.checkoutLineItemsRemove(checkoutId, itemId);

    return Normalizers.cart(response, this.config.storeCurrencyCode);
  }

  async updateCartItemQty(
    itemId: string,
    qty: number
  ): Promise<FSCommerceTypes.Cart> {
    const checkoutId = await this.getOrStartCart();
    const response = await this.api.checkoutLineItemsUpdate(checkoutId, itemId, qty);

    return Normalizers.cart(response, this.config.storeCurrencyCode);
  }

  async submitOrder(
    checkoutId: string
  ): Promise<FSCommerceTypes.Order> {
    const submitResponse = await this.api.checkoutCompleteWithCreditCard(checkoutId, this.payment);

    // submitResponse should now have at least a checkout.id and payment.id
    // if its already successful checkout.order.id will be set
    // if checkout.order.id is not set, they payment could have failed or is still processing
    // load payment information from payment.id
    return this.orderResolver(submitResponse);
  }

  async setBillingAddress(
    options: ShopifyTypes.BillingAddressOptions
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    this.payment.billingAddress = {
      address1: options.address.address1,
      address2: options.address.address2 || '',
      city: options.address.city,
      company: options.address.company,
      country: options.address.countryCode,
      firstName: options.address.firstName,
      lastName: options.address.lastName,
      phone: options.address.phone || '',
      province: options.address.province,
      zip: options.address.postalCode
    };

    return this.fetchCart();
  }

  async setCustomerInfo(
    options: FSCommerceTypes.CustomerInfoOptions
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    const checkoutId = options.cartId || await this.getOrStartCart();
    const response = await this.api.checkoutEmailUpdate(checkoutId, options.email);

    return Normalizers.cart(response, this.config.storeCurrencyCode);
  }

  async setShipmentAddress(
    options: ShopifyTypes.ShippingAddressOptions
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    const checkoutId = options.cartId || await this.getOrStartCart();
    const response = await this.api.checkoutShippingAddressUpdate(checkoutId, options.address);

    return Normalizers.cart(response, this.config.storeCurrencyCode);
  }

  async setShipmentMethod(
    options: FSCommerceTypes.ShipmentMethodOptions
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    const checkoutId = options.cartId || await this.getOrStartCart();
    const response = await this.api.checkoutShippingLineUpdate(checkoutId, options.methodId);

    return Normalizers.cart(response, this.config.storeCurrencyCode);
  }

  async addPayment(
    cartId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    if (!payment || !payment.paymentCard) {
      throw new ShopifyAPIError('addPayment must contain a paymentCard');
    }

    const checkout = await this.fetchCart();
    const [fname = '', lname = ''] = payment.paymentCard.holder
                                      && payment.paymentCard.holder.split(' ') || [];
    const paymentIdempotency = Math.random().toString(36).substring(7);

    const payload = {
      payment: {
        amount: checkout.paymentDue,
        unique_token: paymentIdempotency,
        credit_card: {
          number: payment.paymentCard.number,
          month: payment.paymentCard.expirationMonth,
          year: payment.paymentCard.expirationYear,
          verification_value: payment.paymentCard.securityCode,
          first_name: fname,
          last_name: lname
        }
      }
    };

    const newNetworkClient = new FSNetwork();
    const paymentToken = await newNetworkClient
      .post('https://elb.deposit.shopifycs.com/sessions', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

    if (paymentToken && paymentToken.data && paymentToken.data.id) {
      this.payment.idempotencyKey = paymentIdempotency;
      this.payment.vaultId = paymentToken.data.id;
      this.payment.amount = checkout.paymentDue;
    } else {
      throw new ShopifyAPIError('Unable to exchange payment details for token', paymentToken);
    }

    return checkout;
  }

  // tslint:disable-next-line:cyclomatic-complexity
  async startWalletCheckout(
    checkoutId: string,
    navigator: Navigator,
    onSuccess: (order: FSCommerceTypes.Order) => void,
    test: boolean = false
  ): Promise<void> {
    const checkout = await this.api.getCheckout(checkoutId);
    if (!checkout) {
      throw new ShopifyAPIError('Checkout does not exist');
    }
    if (test) {
      console.debug('checkout:', checkout);
    }

    const ShopifySupportedMethods: PaymentMethodData[] = [];

    // add google pay support if config has a google pay public key
    if (this.googlePayKey) {
      ShopifySupportedMethods.push({
        supportedMethods: ['android-pay'],
        data: {
          supportedNetworks: ['visa', 'mastercard', 'amex', 'discover', 'jcb'],
          currencyCode: 'USD',
          environment: test ? 'TEST' : undefined,
          paymentMethodTokenizationParameters: {
            tokenizationType: 'NETWORK_TOKEN',
            parameters: {
              publicKey: this.googlePayKey
            }
          }
        }
      });
    }

    // add apple pay support if a merchant identifier is configured
    if (this.iosMerchantIdentifier) {
      ShopifySupportedMethods.push({
        supportedMethods: ['apple-pay'],
        data: {
          merchantIdentifier: this.iosMerchantIdentifier,
          supportedNetworks: ['visa', 'mastercard', 'amex', 'discover', 'jcb'],
          countryCode: 'US',
          currencyCode: 'USD'
        }
      });
    }

    if (!ShopifySupportedMethods.length) {
      throw new ShopifyAPIError('No configured wallet providers');
    }

    const orderDetails: PaymentDetailsInit = {
      id: checkoutId,
      displayItems: checkout.lineItems.edges.map((lineItem: ShopifyLineItem) => {
        return {
          label: lineItem.node.title,
          amount: {
            currency: checkout.currencyCode,
            value: lineItem.node.variant.price
          }
        };
      }),
      total: {
        label: 'Your Order',
        amount: {
          currency: checkout.currencyCode,
          value: checkout.paymentDue
        }
      }
    };

    const OPTIONS: PaymentOptions = {
      requestPayerName: true,
      requestPayerPhone: false,
      requestPayerEmail: true,
      requestShipping: true // @TODO: do all shopify checkouts require shipping?
    };

    const payment: ShopifyTokenizedPayment = {
      test,
      amount: orderDetails.total.amount.value,
      type: '',
      paymentData: '',
      idempotencyKey: ''
    };

    if (test) {
      console.log('ShopifySupportedMethods', ShopifySupportedMethods);
      console.log('orderDetails', orderDetails);
    }

    const paymentRequest = new PaymentRequest(ShopifySupportedMethods, orderDetails, OPTIONS);

    // iOS Only: update shipping address on shopify when its selected
    // provide new shipping options to they paymentRequest
    // @TODO: needs testing
    paymentRequest.addEventListener('shippingaddresschange', async e => {
      if (test) {
        console.log('shippingaddresschange', e);
      }

      const shippingAddress = paymentRequest.shippingAddress;
      if (shippingAddress && shippingAddress.recipient) {
        const shopifyShippingAddress = Normalizers.toShopifyAddress(shippingAddress);
        const shippingAdded = await this.api
          .checkoutShippingAddressUpdate(checkoutId, shopifyShippingAddress);
        if (shippingAdded) {
          const updatedCheckout = await this.api.getCheckout(checkoutId, true);

          if (updatedCheckout && updatedCheckout.availableShippingRates) {
            orderDetails.shippingOptions = Normalizers.getShippingMethods(updatedCheckout);
            e.updateWith(orderDetails);
          }
        }
      }
    });

    // iOS Only: update shipping method on shopify when its selected
    // @TODO: needs testing
    paymentRequest.addEventListener('shippingoptionchange', async e => {
      if (test) {
        console.log('shippingoptionchange', e);
      }

      const shippingHandle = paymentRequest.shippingOption;
      if (shippingHandle) {
        const updatedCheckout = await this.api
          .checkoutShippingLineUpdate(checkoutId, shippingHandle);

        if (updatedCheckout) {
          orderDetails.shippingOptions = Normalizers.getShippingMethods(updatedCheckout);
          orderDetails.total.amount.value = updatedCheckout.paymentDue;
          payment.amount = updatedCheckout.paymentDue;
          e.updateWith(orderDetails);
        }
      }
    });

    const paymentResponse = await paymentRequest.show();
    if (!paymentResponse) {
      throw new ShopifyAPIError('No paymentResponse');
    }
    if (!paymentRequest.shippingAddress) {
      throw new ShopifyAPIError('No shipping address selected');
    }

    if (test) {
      console.log('paymentResponse', paymentResponse);
    }

    // set billing address to the shipping address so we can load shipping methods
    const billingAddress = Normalizers.toMailingAddressInput(paymentRequest.shippingAddress);
    payment.billingAddress = billingAddress;

    // add customer email address to checkout
    const email = paymentResponse.payerEmail || checkout.email;
    if (!email) {
      throw new ShopifyAPIError('email address is required', paymentResponse);
    }
    if (!checkout.email || (email !== checkout.email)) {
      await this.api.checkoutEmailUpdate(checkoutId, email);
    }

    if (Platform.OS === 'android') {
      // @TODO: if checkout has shippingLine then we dont need the first prompt for shipping addr
      // Update shipping methods and re request one
      const shopifyShippingAddress = Normalizers.toShopifyAddress(paymentRequest.shippingAddress);
      const shippingAdded = await this.api
        .checkoutShippingAddressUpdate(checkoutId, shopifyShippingAddress);
      if (shippingAdded) {
        // wait for shopify to process the shipping address
        // if we request it instantly, shipping methods wont be ready yet
        await new Promise<any>(resolve => setTimeout(resolve, 2000));

        const updatedCheckout = await this.api.getCheckout(checkoutId, true);
        if (updatedCheckout && updatedCheckout.availableShippingRates &&
          updatedCheckout.availableShippingRates.ready
        ) {
          orderDetails.shippingOptions = Normalizers.getShippingMethods(updatedCheckout);
        }
      }

      if (!orderDetails.shippingOptions) {
        throw new ShopifyAPIError('unable to update shipping method and request options');
      }

      if (!this.config.googlePayScreenName) {
        throw new Error('You must provide the name of the screen to ' +
          'be used for the Google Pay Shipping Options Modal');
      }

      // need to show modal here to present the user with shipping options
      navigator.showModal({
        screen: this.config.googlePayScreenName,
        title: 'Google Pay',
        passProps: {
          datasource: this,
          checkoutId,
          onSuccess,
          test,
          payment,
          ShopifySupportedMethods,
          orderDetails
        }
      });

      // the modal continues the process and calls onSuccess
    } else {
      // paymentResponse is the token
      payment.type = 'apple_pay';
      payment.paymentData = JSON.stringify(paymentResponse.details);
      payment.idempotencyKey = payment.paymentData; // @TODO: Is this a good key to use?

      const submitResponse = await this.api
        .checkoutCompleteWithTokenizedPayment(checkoutId, payment);
      const resolvedOrder = await this.orderResolver(submitResponse);
      // dismiss apple pay dialog
      paymentResponse.complete(resolvedOrder ? 'success' : 'fail');
      onSuccess(resolvedOrder);
      return;
    }
  }

  // @TODO: test and validate promo code apply
  async applyPromo(
    promoCode: string
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    const checkoutId = await this.getOrStartCart();
    const response = await this.api.checkoutDiscountCodeApply(checkoutId, promoCode);

    return Normalizers.cart(response, this.config.storeCurrencyCode);
  }

  // @TODO: test and validate promo code remove
  async removePromo(
    promoItemId: string
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }

  async fetchShippingMethods(
    cartId: string,
    shipmentId: string
  ): Promise<FSCommerceTypes.ShippingMethodResponse> {
    const response = await this.api.getCheckout(cartId, true);

    if (!response.availableShippingRates || !response.availableShippingRates.ready) {
      throw new ShopifyAPIError('Shipping rates are not ready.');
    }

    return Normalizers.shippingMethods(response, this.config.storeCurrencyCode);
  }

  // region Unused functions
  async updateGiftOptions(
    giftOptions: FSCommerceTypes.GiftOptions
  ): Promise<ShopifyTypes.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }

  async destroyCart(): Promise<void> {
    return Promise.reject(kErrorMessageNotImplemented);
  }

  async fetchPaymentMethods(cartId: string): Promise<FSCommerceTypes.ApplicablePayment[]> {
    return Promise.reject(kErrorMessageNotImplemented);
  }

  async updateOrder(order: FSCommerceTypes.Order): Promise<FSCommerceTypes.Order> {
    return Promise.reject(kErrorMessageNotImplemented);
  }

  async updateOrderPayment(
    orderId: string,
    paymentId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Order> {
    return Promise.reject(kErrorMessageNotImplemented);
  }

  async updatePayment(
    cartId: string,
    paymentId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Cart> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  // endregion

  async orderResolver(
    submitResponse: CheckoutResponse
  ): Promise<FSCommerceTypes.Order> {
    // try for 10 seconds to get payment
    const paymentInfo = await this.paymentResolve(submitResponse.payment.id, 10);
    if (paymentInfo.transaction.status !== 'SUCCESS') {
      throw new ShopifyAPIError(`Payment status: ${paymentInfo.transaction.status}`, paymentInfo);
    } else {
      // the payment was successful, checkout object should have an order.id now

      if (paymentInfo.checkout.order && paymentInfo.checkout.order.id) {
        // order was successful
        return Normalizers.order(
          await this.api.getOrder(paymentInfo.checkout.order.id),
          paymentInfo,
          this.config.storeCurrencyCode
        );
      } else {
        throw new ShopifyAPIError('Checkout failure', paymentInfo);
      }
    }
  }
}
