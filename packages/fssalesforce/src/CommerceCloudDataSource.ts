
import * as Classes from './classes';
import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';

const kErrorMessageStandIn = 'Stand-In Method';

/**
 * Data source that allows for interaction with a Demandware API.
 */
export class CommerceCloudDataSource extends Classes.DemandwareBase
                                     implements Classes.DemandwareAccountDataSource,
                                                Classes.DemandwareCartDataSource,
                                                Classes.DemandwareProductCatalogAndSearchDataSource,
                                                Classes.DemandwareProductRecommendationDataSource {

  async fetchProductRecommendations(id: string): Promise<FSCommerceTypes.Product[]> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchCategory(
    id?: string,
    query?: FSCommerceTypes.CategoryQuery
  ): Promise<FSCommerceTypes.Category> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchProduct(id: string): Promise<FSCommerceTypes.Product> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchProductIndex(
    query: FSCommerceTypes.ProductQuery
  ): Promise<FSCommerceTypes.ProductIndex> {
    throw new Error(kErrorMessageStandIn);
  }

  async search(
    keyword: string,
    query?: FSCommerceTypes.ProductQuery
  ): Promise<FSCommerceTypes.ProductIndex> {
    throw new Error(kErrorMessageStandIn);
  }

  async searchSuggestion(keyword: string): Promise<FSCommerceTypes.SearchSuggestion> {
    throw new Error(kErrorMessageStandIn);
  }

  async applyPromo(promoCode: string): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async removePromo(promoItemId: string): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async updateGiftOptions(options: FSCommerceTypes.GiftOptions): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async updateOrder(
    order: Partial<FSCommerceTypes.Order> & Pick<FSCommerceTypes.Order, 'orderId'>
  ): Promise<FSCommerceTypes.Order> {
    throw new Error(kErrorMessageStandIn);
  }

  async updateOrderPayment(
    orderId: string,
    paymentId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Order> {
    throw new Error(kErrorMessageStandIn);
  }

  async submitOrder(cartId: string): Promise<FSCommerceTypes.Order> {
    throw new Error(kErrorMessageStandIn);
  }

  async setShipmentMethod(
    options: FSCommerceTypes.ShipmentMethodOptions
  ): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async addToCart(
    productId: string,
    qty: number = 1,
    product?: FSCommerceTypes.Product
  ): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async setShipmentAddress(
    options: FSCommerceTypes.ShipmentAddressOptions
  ): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async setCustomerInfo(
    options: FSCommerceTypes.CustomerInfoOptions
  ): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async setBillingAddress(
    options: FSCommerceTypes.BillingAddressOptions
  ): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchShippingMethods(
    cartId: string,
    shipmentId: string
  ): Promise<FSCommerceTypes.ShippingMethodResponse> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchPaymentMethods(cartId: string): Promise<FSCommerceTypes.ApplicablePayment[]> {
    throw new Error(kErrorMessageStandIn);
  }

  async removeCartItem(itemId: string): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async updateCartItemQty(itemId: string, qty: number): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async destroyCart(): Promise<any> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchCart(query?: FSCommerceTypes.CartQuery): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async addPayment(
    cartId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async updatePayment(
    cartId: string,
    paymentId: string,
    payment: FSCommerceTypes.Payment
  ): Promise<FSCommerceTypes.Cart> {
    throw new Error(kErrorMessageStandIn);
  }

  async login(
    username: string,
    password: string,
    options?: FSCommerceTypes.LoginOptions
  ): Promise<FSCommerceTypes.SessionToken> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchOrder(orderId: string): Promise<any> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchOrders(): Promise<any> {
    throw new Error(kErrorMessageStandIn);
  }

  async forgotPassword(email: string): Promise<boolean> {
    throw new Error(kErrorMessageStandIn);
  }

  async updatePassword(
    currentPassword: string,
    password: string
  ): Promise<boolean> {
    throw new Error(kErrorMessageStandIn);
  }

  async register(
    account: FSCommerceTypes.CustomerAccount,
    password: string
  ): Promise<FSCommerceTypes.CustomerAccount> {
    throw new Error(kErrorMessageStandIn);
  }

  async logout(): Promise<any> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchSavedAddresses(): Promise<FSCommerceTypes.CustomerAddress[]> {
    throw new Error(kErrorMessageStandIn);
  }

  async addSavedAddress(
    address: FSCommerceTypes.CustomerAddress
  ): Promise<FSCommerceTypes.CustomerAddress> {
    throw new Error(kErrorMessageStandIn);
  }

  async editSavedAddress(
    address: FSCommerceTypes.CustomerAddress
  ): Promise<FSCommerceTypes.CustomerAddress> {
    throw new Error(kErrorMessageStandIn);
  }


  async deleteSavedAddress(addressId: string): Promise<boolean> {
    throw new Error(kErrorMessageStandIn);
  }

  async fetchSavedPayments(methodId?: string): Promise<FSCommerceTypes.PaymentMethod[]> {
    throw new Error(kErrorMessageStandIn);
  }

  async addSavedPayment(
    payment: FSCommerceTypes.PaymentMethod
  ): Promise<FSCommerceTypes.PaymentMethod> {
    throw new Error(kErrorMessageStandIn);
  }

  async deleteSavedPayment(paymentsId: string): Promise<boolean> {
    throw new Error(kErrorMessageStandIn);
  }


  async fetchAccount(): Promise<FSCommerceTypes.CustomerAccount> {
    throw new Error(kErrorMessageStandIn);
  }

  async updateAccount(
    account: FSCommerceTypes.CustomerAccount
  ): Promise<FSCommerceTypes.CustomerAccount> {
    throw new Error(kErrorMessageStandIn);
  }
}

applyMixins(CommerceCloudDataSource, [
  Classes.DemandwareAccountDataSource,
  Classes.DemandwareCartDataSource,
  Classes.DemandwareProductCatalogAndSearchDataSource,
  Classes.DemandwareProductRecommendationDataSource
]);

function applyMixins(derivedCtor: any, baseCtors: any[]): void {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}
