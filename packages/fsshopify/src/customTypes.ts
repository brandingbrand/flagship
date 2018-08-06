import {CommerceTypes} from '@brandingbrand/fscommerce';
import { GeoLocation } from '@brandingbrand/fsfoundation';
import {
  ShopifyCheckout,
  ShopifyPageInfo,
  ShopifyTokenizedPayment
} from './util/ShopifyResponseTypes';
import ShopifyDataSource from './ShopifyDataSource';
import {
  PaymentDetailsInit,
  PaymentMethodData
} from 'react-native-payments';

export interface ShopifyAddress extends CommerceTypes.Address, GeoLocation {
  zip: string;
  province: string;
  company: string;
  country: string;
  name: string;
  provinceCode: string;
  formatted: string[];
}

export interface BillingAddressOptions extends CommerceTypes.BillingAddressOptions {
  address: ShopifyAddress;
}

export interface ShippingAddressOptions extends CommerceTypes.ShipmentAddressOptions {
  address: ShopifyAddress;
}

export interface ShopifyCheckoutData extends CommerceTypes.Cart {
  id: string;

  shippingAddress?: ShopifyAddress;
  shippingMethods?: CommerceTypes.ShippingMethod[];
  selectedShippingMethodId?: string;
  paymentDue: string;

  shopifyCheckout?: ShopifyCheckout;
}

export interface ShopifyCartQuery extends CommerceTypes.CartQuery {
  cartId: string;
}

export interface ShopifyConfig {
  domain: string;
  storefrontAccessToken: string;
  googlePayPublicKey?: string;

  /**
   * The name of the registered screen that will be used to
   * display the Google Pay Shipping Options modal
   */
  googlePayScreenName?: string;

  iosMerchantIdentifier?: string;

  /**
   * The default ISO 4217 currency code for the entire store
   * @example USD
   */
  storeCurrencyCode: string;
}

export interface ShopifyProductIndex extends ShopifyPageInfo, CommerceTypes.ProductIndex {
  nextPage?: string;
}

export interface ShopifyMailingAddressInput {
  address1: string;
  address2: string;
  city: string;
  company: string;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  zip: string;
}

export interface GooglePayShippingOptionsModalProps {
  test: boolean;
  datasource: ShopifyDataSource;
  checkoutId: string;
  onSuccess: (order: CommerceTypes.Order) => void;
  ShopifySupportedMethods: PaymentMethodData[];
  orderDetails: PaymentDetailsInit;
  payment: ShopifyTokenizedPayment;
}
