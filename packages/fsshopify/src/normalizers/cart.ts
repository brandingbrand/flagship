import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import * as ResponseTypes from '../util/ShopifyResponseTypes';
import * as Types from '../customTypes';
import { makeCurrency } from './helpers';

export function cart(
  cartData: ResponseTypes.ShopifyCheckout,
  currency: string
): Types.ShopifyCheckoutData {
  const currencyCode = cartData.currencyCode || currency;
  return {
    id: cartData.id,
    items: cartData.lineItems.edges.map(item => cartItem(item, currencyCode)),
    subtotal: makeCurrency(cartData.subtotalPrice, currencyCode),
    total: makeCurrency(cartData.subtotalPrice, currencyCode),
    shipping: cartData.shippingLine && makeCurrency(cartData.shippingLine.price, currencyCode),
    tax: makeCurrency(cartData.totalTax, currencyCode),

    // shopify custom things on 'cart'
    shippingAddress: cartData.shippingAddress || undefined,
    shippingMethods: cartData.availableShippingRates
      ? methods(cartData.availableShippingRates, currencyCode)
      : undefined,
    selectedShippingMethodId: cartData.shippingLine && cartData.shippingLine.handle,
    paymentDue: cartData.paymentDue
  };
}

function methods(
  data: ResponseTypes.ShopifyShippingRates,
  currency: string
): FSCommerceTypes.ShippingMethod[] {
  let rates: FSCommerceTypes.ShippingMethod[] = [];
  if (data && data.ready) {
    rates = data.shippingRates.map(shopifyRate => ({
      id: shopifyRate.handle,
      name: shopifyRate.title,
      price: makeCurrency(shopifyRate.price, currency),
      description: shopifyRate.title
    }));
  }
  return rates;
}

export function cartItem(
  cartItemData: ResponseTypes.ShopifyLineItem,
  currency: string
): FSCommerceTypes.CartItem {
  const cartItemNode = cartItemData.node || {};
  const custom = cartItemNode.customAttributes;
  let productId = '';
  if (custom && custom.length) {
    for (const attr of custom) {
      if (attr.key === 'productId') {
        productId = attr.value;

        break;
      }
    }
  }
  return {
    itemId: cartItemNode.id,
    productId,
    title: cartItemNode.title + ', ' + cartItemNode.variant.title,
    quantity: cartItemNode.quantity,
    handle: cartItemNode.variant.id,
    price: makeCurrency(cartItemNode.variant.price, currency),
    available: cartItemNode.variant.available,
    itemText: cartItemNode.variant.title,
    images: [
      { uri: cartItemNode.variant.image && cartItemNode.variant.image.src }
    ]
  };
}
