import { CommerceTypes } from '@brandingbrand/fscommerce';
import { ShopifyMailingAddressInput } from '../customTypes';

export function mailingAddressInput(address: CommerceTypes.Address): ShopifyMailingAddressInput {
  return {
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    company: address.companyName,
    country: address.countryCode,
    firstName: address.firstName,
    lastName: address.lastName,
    phone: address.phone,
    province: address.stateCode,
    zip: address.postalCode
  };
}
