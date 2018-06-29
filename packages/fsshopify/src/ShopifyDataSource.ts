import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import { CheckoutResponse } from './util/ShopifyResponseTypes';
import DataSourceBase from './util/DataSourceBase';
import * as Types from './customTypes';
import * as Mixins from './mixins';
import { Navigator } from 'react-native-navigation';

const kErrorMessageNotImplemented = 'not implemented';

export default class ShopifyDataSource extends DataSourceBase
                                       implements Mixins.ShopifyProductCatalogDataSource,
                                                  Mixins.ShopifyCartDataSource {

  // region Stand-in methods for ShopifyProductCatalogDataSource
  async fetchProduct(id: string): Promise<FSCommerceTypes.Product> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async fetchProductIndex(
    query: FSCommerceTypes.ProductQuery
  ): Promise<Types.ShopifyProductIndex> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async fetchCategory(
    id?: string,
    query?: FSCommerceTypes.CategoryQuery
  ): Promise<FSCommerceTypes.Category> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  // endregion

  // region Stand-in methods for ShopifyCartDataSource
  async addToCart(
    productId: string,
    qty?: number,
    product?: FSCommerceTypes.Product
  ): Promise<any> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async addPayment(
    cartId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async startWalletCheckout(
    checkoutId: string,
    navigator: Navigator,
    onSuccess: (order: FSCommerceTypes.Order) => void,
    test: boolean = false
  ): Promise<void> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async fetchCart(query?: FSCommerceTypes.CartQuery): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async destroyCart(): Promise<void> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async fetchPaymentMethods(cartId: string): Promise<FSCommerceTypes.ApplicablePayment[]> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async fetchShippingMethods(
    cartId: string,
    shipmentId: string
  ): Promise<FSCommerceTypes.ShippingMethodResponse> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async removeCartItem(itemId: string): Promise<FSCommerceTypes.Cart> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async setBillingAddress(
    options: FSCommerceTypes.BillingAddressOptions
  ): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async setCustomerInfo(
    options: FSCommerceTypes.CustomerInfoOptions
  ): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async setShipmentAddress(
    options: Types.ShippingAddressOptions
  ): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async setShipmentMethod(
    options: FSCommerceTypes.ShipmentMethodOptions
  ): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async submitOrder(cartId: string): Promise<FSCommerceTypes.Order> {
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
  async updateCartItemQty(itemId: string, qty: number): Promise<FSCommerceTypes.Cart> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async updatePayment(
    cartId: string,
    paymentId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Cart> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async updateGiftOptions(
    giftOptions: FSCommerceTypes.GiftOptions
  ): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async applyPromo(promoCode: string): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  async removePromo(promoItemId: string): Promise<Types.ShopifyCheckoutData> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
  // endregion
  async orderResolver(
    submitResponse: CheckoutResponse
  ): Promise<FSCommerceTypes.Order> {
    return Promise.reject(kErrorMessageNotImplemented);
  }
}

applyMixins(ShopifyDataSource, [
  Mixins.ShopifyCartDataSource,
  Mixins.ShopifyProductCatalogDataSource
]);

function applyMixins(derivedCtor: any, baseCtors: any[]): void {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}
