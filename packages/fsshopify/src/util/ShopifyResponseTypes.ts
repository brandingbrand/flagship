import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import { ShopifyMailingAddressInput } from '..';

export interface ShopifyCollections {
  pageInfo: ShopifyPageInfo;
  edges: ShopifyCollectionContainer[];
}

export interface ShopifyCollectionContainer {
  cursor: string;
  node: ShopifyCollection;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  updatedAt: string;
  title: string;
  image: ShopifyImage;
}

export interface CheckoutResponse {
  checkout: {
    id: string;
    completedAt: string;
    order: {
      id: string;
    };
  };
  payment: {
    id: string;
  };
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ShopifyProductIndexProductContainer {
  cursor: string;
  node: ShopifyProduct;
}

export interface ShopifyProductIndex extends ShopifyCollection {
  products: {
    pageInfo: ShopifyPageInfo;
    edges: ShopifyProductIndexProductContainer[];
  };
}

export interface ShopifyCheckoutData extends FSCommerceTypes.Cart {
  id: string;

  shippingAddress?: ShopifyAddress;
  shippingMethods?: FSCommerceTypes.ShippingMethod[];
  selectedShippingMethodId?: string;
  paymentDue: string;

  shopifyCheckout?: ShopifyCheckout;
}

export interface BasePayment {
  amount: string;
  idempotencyKey: string;
  test: boolean;
  billingAddress?: ShopifyMailingAddressInput;
}

export interface ShopifyCreditCardPayment extends BasePayment {
  vaultId: string;
}

export interface ShopifyTokenizedPayment extends BasePayment {
  type: string;
  identifier?: string;
  paymentData: string;
}

export interface ShopifyCartQuery extends FSCommerceTypes.CartQuery {
  cartId: string;
}

export interface ShopifyOrder {
  id: string;
  processedAt: string;
  orderNumber: number;
  subtotalPrice: string;
  totalShippingPrice: string;
  totalTax: string;
  totalPrice: string;
  currencyCode: string;
  totalRefunded: string;
  customerUrl: string;
  shippingAddress: ShopifyAddress;
  lineItems: ShopifyLineItems;
}

export interface ShopifyTransaction {
  status: string;
}

export interface ShopifyCustomAttribute {
  key: string;
  value: string;
}

export interface ShopifyShippingRateLine {
  handle: string;
  price: string;
  title: string;
}

export interface ShopifyShippingRates {
  ready: boolean;
  shippingRates: ShopifyShippingRateLine[];
}

export interface ShopifyAddress extends FSCommerceTypes.Address {
  zip: string;
  province: string;
  company: string;
  country: string;
  latitude: number;
  longitude: number;
  name: string;
  provinceCode: string;
  formatted: string[];
}

export interface ShopifyImage {
  id: string;
  src: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface ShopifyOption {
  name: string;
  value?: string;
  values?: string[];
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string;
  weight: number;
  available: boolean;
  image?: ShopifyImage;
  selectedOptions: ShopifyOption[];
}

export interface ShopifyProductVariantContainerEdge {
  cursor: string;
  node: ShopifyProductVariant;
}

export interface ShopifyProductVariantContainer {
  pageInfo: ShopifyPageInfo;
  edges: ShopifyProductVariantContainerEdge[];
}

export interface ShopifyProductImageContainerEdge {
  cursor: string;
  node: ShopifyImage;
}

export interface ShopifyProductImageContainer {
  pageInfo: ShopifyPageInfo;
  edges: ShopifyProductImageContainerEdge[];
}

export interface ShopifyProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
  descriptionHtml: string;
  description: string;
  handle: string;
  productType: string;
  title: string;
  vendor: string;
  tags: string[];
  publishedAt: string;
  onlineStoreUrl: string;
  variants: ShopifyProductVariantContainer;
  quantity: number;
  customAttributes: ShopifyCustomAttribute[];
  options: ShopifyOption[];
  images: ShopifyProductImageContainer;
}
export interface ShopifyLineItemProduct extends ShopifyProduct {
  variant: ShopifyProductVariant;
}

export interface ShopifyLineItem {
  cursor: string;
  node: ShopifyLineItemProduct;
}

export interface ShopifyLineItems {
  pageInfo: ShopifyPageInfo;
  edges: ShopifyLineItem[];
}

export interface ShopifyCheckout {
  id: string;
  email: string;
  ready: boolean;
  availableShippingRates?: ShopifyShippingRates;
  requiresShipping: boolean;
  note: string;
  paymentDue: string;
  webUrl: string;
  orderStatusUrl: string;
  taxExempt: boolean;
  taxesIncluded: boolean;
  currencyCode: string;
  totalTax: string;
  subtotalPrice: string;
  totalPrice: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShopifyAddress;
  shippingLine: ShopifyShippingRateLine;
  customAttributes: ShopifyCustomAttribute[];
  order: ShopifyOrder;
  lineItems: ShopifyLineItems;
}

export interface ShopifyCreditCard {
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  firstDigits: string;
  firstName: string;
  lastDigits: string;
  lastName: string;
  maskedNumber: string;
}

export interface ShopifyPayment {
  id: string;
  amount: string;
  ready: boolean;
  test: boolean;
  checkout: ShopifyCheckout;
  errorMessage: string;
  transaction: ShopifyTransaction;
  billingAddress: ShopifyAddress;
  creditCard: ShopifyCreditCard;
}
