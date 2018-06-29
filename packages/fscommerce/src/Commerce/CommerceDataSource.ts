import { ApplicablePayment } from './types/ApplicablePayment';
import { BillingAddressOptions } from './types/BillingAddressOptions';
import { Cart } from './types/Cart';
import { CartQuery } from './types/CartQuery';
import { Category } from './types/Category';
import { CategoryQuery } from './types/CategoryQuery';
import { CustomerAccount } from './types/CustomerAccount';
import { CustomerAddress } from './types/CustomerAddress';
import { CustomerInfoOptions } from './types/CustomerInfoOptions';
import { GiftOptions } from './types/GiftOptions';
import { LoginOptions } from './types/LoginOptions';
import { Order } from './types/Order';
import { Payment } from './types/Payment';
import { PaymentMethod } from './types/PaymentMethod';
import { Product } from './types/Product';
import { ProductIndex } from './types/ProductIndex';
import { ProductQuery } from './types/ProductQuery';
import { SearchSuggestion } from './types/SearchSuggestion';
import { SessionToken } from './types/SessionToken';
import { ShipmentAddressOptions } from './types/ShipmentAddressOptions';
import { ShipmentMethodOptions } from './types/ShipmentMethodOptions';
import { ShippingMethodResponse } from './types/ShippingMethodResponse';

import AccountDataSource from './interfaces/AccountDataSource';
import CartDataSource from './interfaces/CartDataSource';
import ProductCatalogDataSource from './interfaces/ProductCatalogDataSource';
import ProductRecommendationDataSource from './interfaces/ProductRecommendationDataSource';
import ProductSearchDataSource from './interfaces/ProductSearchDataSource';

export default abstract class CommerceDataSource implements AccountDataSource,
                                                            CartDataSource,
                                                            ProductRecommendationDataSource,
                                                            ProductSearchDataSource,
                                                            ProductCatalogDataSource {

  // Minumum number of refinements to expect in product queries. For example, on grid pages,
  // Demandware includes the current category ID as a refinement whereas this won't be the
  // case on scraped APIs.
  abstract minRefinements: number;

  abstract fetchProduct(id: string): Promise<Product>;
  abstract fetchProductIndex(query: ProductQuery): Promise<ProductIndex>;
  abstract fetchProductRecommendations(id: string): Promise<Product[]>;
  abstract fetchCategory(id?: string, query?: CategoryQuery): Promise<Category>;
  abstract search(keyword: string, query?: ProductQuery): Promise<ProductIndex>;
  abstract searchSuggestion(keyword: string): Promise<SearchSuggestion>;

  // Cart
  abstract addToCart(productId: string, qty?: number, product?: Product): Promise<any>;
  abstract addPayment(cartId: string, payment: Payment): Promise<Cart>;
  abstract fetchCart(query?: CartQuery): Promise<Cart>;
  abstract destroyCart(): Promise<void>;
  abstract fetchPaymentMethods(cartId: string): Promise<ApplicablePayment[]>;
  abstract fetchShippingMethods(
    cartId: string,
    shipmentId: string
  ): Promise<ShippingMethodResponse>;
  abstract removeCartItem(itemId: string): Promise<Cart>;
  abstract setBillingAddress(options: BillingAddressOptions): Promise<Cart>;
  abstract setCustomerInfo(options: CustomerInfoOptions): Promise<Cart>;
  abstract setShipmentAddress(options: ShipmentAddressOptions): Promise<Cart>;
  abstract setShipmentMethod(options: ShipmentMethodOptions): Promise<Cart>;
  abstract submitOrder(cartId: string): Promise<Order>;
  abstract updateOrder(order: Order): Promise<Order>;
  abstract updateOrderPayment(orderId: string, paymentId: string, payment: Payment): Promise<Order>;
  abstract updateCartItemQty(itemId: string, qty: number): Promise<Cart>;
  abstract updatePayment(
    cartId: string,
    paymentId: string,
    payment: Payment
  ): Promise<Cart>;
  abstract updateGiftOptions(giftOptions: GiftOptions): Promise<Cart>;

  // Promo
  abstract applyPromo(promoCode: string): Promise<Cart>;
  abstract removePromo(promoItemId: string): Promise<Cart>;

  // Session
  abstract login(
    username: string,
    password: string,
    options?: LoginOptions
  ): Promise<SessionToken>;
  abstract logout(username: string, password: string): Promise<boolean>;
  abstract register(
    account: CustomerAccount,
    password: string
  ): Promise<CustomerAccount>;

  // Account
  abstract fetchSavedAddresses(): Promise<CustomerAddress[]>;
  abstract addSavedAddress(address: CustomerAddress): Promise<CustomerAddress>;
  abstract editSavedAddress(address: CustomerAddress): Promise<CustomerAddress>;
  abstract deleteSavedAddress(addressId: string): Promise<boolean>;
  abstract fetchSavedPayments(methodId?: string): Promise<PaymentMethod[]>;
  abstract addSavedPayment(payment: PaymentMethod): Promise<PaymentMethod>;
  abstract deleteSavedPayment(paymentId: string): Promise<boolean>;
  abstract forgotPassword(email: string): Promise<boolean>;
  abstract fetchAccount(): Promise<CustomerAccount>;
  abstract updateAccount(account: CustomerAccount): Promise<CustomerAccount>;
  abstract updatePassword(
    currentPassword: string,
    password: string
  ): Promise<boolean>;
  abstract fetchOrders(): Promise<Order[]>;
  abstract fetchOrder(orderId: string): Promise<Order>;
}
