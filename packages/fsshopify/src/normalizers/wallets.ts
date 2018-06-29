import {
  ShopifyCheckout,
  ShopifyShippingRateLine
} from '../util/ShopifyResponseTypes';
import {
  PaymentAddress,
  PaymentShippingOption
} from 'react-native-payments';
import ShopifyAPIError from '../util/ShopifyAPIError';
import * as ShopifyTypes from '../customTypes';

/**
 * Converts Shopify shipping options to the paymentRequest details format
 *
 * @export
 * @param {ShopifyCheckout} checkout The shopify checkout object
 * @returns {PaymentShippingOption[]} The available shipping methods
 */
export function getShippingMethods(
  checkout: ShopifyCheckout
): PaymentShippingOption[] {
  if (!checkout.availableShippingRates) {
    throw new ShopifyAPIError('No available shipping rates');
  }
  return checkout.availableShippingRates.shippingRates
    .map((shippingRate: ShopifyShippingRateLine) => {
      return {
        id: shippingRate.handle,
        label: shippingRate.title,
        amount: {
          currency: checkout.currencyCode,
          value: shippingRate.price
        },
        selected: !!(checkout.shippingLine
          && checkout.shippingLine.handle === shippingRate.handle)
      };
    });
}

/**
 * Converts a paymentRequest shipping address  to a shopify shipping address
 *
 * @param {PaymentAddress} shippingAddress The shipping address input
 * @returns {ShopifyTypes.ShopifyAddress} The shopify formatted shipping address
 */
export function toShopifyAddress(
  shippingAddress: PaymentAddress
): ShopifyTypes.ShopifyAddress {
  if (!shippingAddress || !shippingAddress.recipient) {
    throw new ShopifyAPIError('ShippingAddress or fields missing');
  }

  const [fName, lName] = shippingAddress.recipient.split(' ');
  let address1 = '';
  let address2 = '';
  if (Array.isArray(shippingAddress.addressLine)) {
    address1 = shippingAddress.addressLine[0];
    address2 = shippingAddress.addressLine[1];
  } else {
    address1 = shippingAddress.addressLine;
  }

  return {
    firstName: fName,
    lastName: lName,
    address1,
    address2,
    city: shippingAddress.city,
    stateCode: shippingAddress.region,
    countryCode: shippingAddress.country,
    latitude: 0,
    longitude: 0,
    zip: shippingAddress.postalCode,
    postalCode: shippingAddress.postalCode,
    province: shippingAddress.region,
    company: shippingAddress.organization || '',
    country: shippingAddress.country,
    name: shippingAddress.recipient,
    provinceCode: '',
    formatted: []
  };
}

export function toMailingAddressInput(
  address: PaymentAddress
): ShopifyTypes.ShopifyMailingAddressInput {
  if (!address || !address.recipient) {
    throw new ShopifyAPIError('address or recipient missing');
  }

  const [firstName, lastName] = address.recipient.split(' ');
  let address1 = '';
  let address2 = '';
  if (Array.isArray(address.addressLine)) {
    address1 = address.addressLine[0];
    address2 = address.addressLine[1];
  } else {
    address1 = address.addressLine;
  }

  return {
    address1,
    address2,
    city: address.city,
    company: address.organization || '',
    country: address.country,
    firstName,
    lastName,
    phone: address.phone || '',
    province: address.region,
    zip: address.postalCode
  };
}
