import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import * as ResponseTypes from '../util/ShopifyResponseTypes';
import ShopifyAPIError from '../util/ShopifyAPIError';
import { makeCurrency } from './helpers';

export function shippingMethods(
  checkout: ResponseTypes.ShopifyCheckout,
  currency: string
): FSCommerceTypes.ShippingMethodResponse {
  const currencyCode = checkout.currencyCode || currency;
  if (!checkout.availableShippingRates || !checkout.availableShippingRates.ready) {
    throw new ShopifyAPIError('Shipping rates are not ready.');
  }

  return {
    defaultMethodId: checkout.availableShippingRates.shippingRates[0].handle,
    shippingMethods: checkout.availableShippingRates.shippingRates
      .map(method => shippingMethod(method, currencyCode))
  };
}

function shippingMethod(
  line: ResponseTypes.ShopifyShippingRateLine,
  currency: string
): FSCommerceTypes.ShippingMethod {

  return {
    id: line.handle,
    name: line.title,
    price: makeCurrency(line.price, currency)
  };
}
