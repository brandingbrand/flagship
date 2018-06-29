import { CommerceTypes as FSCommerceTypes } from '@brandingbrand/fscommerce';
import { DemandwareProductQuery, ValidOrderStatus } from './Types';

export interface PriceRange { min: number; max: number; }

const ORDER_STATUSES = ['created', 'new', 'open', 'completed', 'cancelled', 'replaced', 'failed'];

// convert the standard data structure back to demandware structures
/* tslint:disable: cyclomatic-complexity */
function address(address: FSCommerceTypes.Address): Partial<SFCC.CustomerAddress> | null {
  if (!address) {
    return null;
  }
  const data: Partial<SFCC.CustomerAddress> = {
    address_id: address.id,
    address1: address.address1,
    city: address.city,
    country_code: address.countryCode,
    first_name: address.firstName,
    last_name: address.lastName,
    postal_code: address.postalCode,
    state_code: address.stateCode
  };
  if (address.address2) {
    data.address2 = address.address2;
  }
  if (address.companyName) {
    data.company_name = address.companyName;
  }
  if (address.fullName) {
    data.full_name = address.fullName;
  }
  if (address.jobTitle) {
    data.job_title = address.jobTitle;
  }
  if (address.phone) {
    data.phone = address.phone;
  }
  if (address.postBox) {
    data.post_box = address.postBox;
  }
  if (address.salutation) {
    data.salutation = address.salutation;
  }
  if (address.secondName) {
    data.second_name = address.secondName;
  }
  if (address.suffix) {
    data.suffix = address.suffix;
  }
  if (address.suite) {
    data.suite = address.suite;
  }
  if (address.title) {
    data.title = address.title;
  }
  return data;
}

function customerAddress(
  customerAddress: FSCommerceTypes.CustomerAddress
): Partial<SFCC.CustomerAddress> | null {
  const formattedAddress = address(customerAddress);

  if (!formattedAddress) {
    return null;
  }

  return {
    ...formattedAddress,
    preferred: customerAddress.preferred
  };
}

function paymentBankAccount(
  data: FSCommerceTypes.PaymentBankAccount
): SFCC.PaymentBankAccountRequest | undefined {
  if (!data) {
    return undefined;
  }
  return {
    drivers_license: data.driversLicense,
    drivers_license_state_code: data.driversLicenseStateCode,
    holder: data.holder,
    number: data.number
  };
}

function paymentCard(data: FSCommerceTypes.PaymentCard): SFCC.OrderPaymentCardRequest | undefined {
  if (!data) {
    return undefined;
  }
  return {
    card_type: data.cardType,
    credit_card_token: data.creditCardToken,
    expiration_month: data.expirationMonth,
    expiration_year: data.expirationYear,
    holder: data.holder,
    issue_number: data.issueNumber,
    number: data.number,
    security_code: data.securityCode,
    valid_from_month: data.validFromMonth,
    valid_from_year: data.validFromYear
  };
}

function payment(data: FSCommerceTypes.Payment): SFCC.BasketPaymentInstrumentRequest | null {
  if (!data) {
    return null;
  }
  const result: SFCC.BasketPaymentInstrumentRequest = {};
  if (data.amount) {
    result.amount = data.amount.value.toNumber();
  }
  if (data.bankRoutingNumber) {
    result.bank_routing_number = data.bankRoutingNumber;
  }
  if (data.customerPaymentId) {
    result.customer_payment_instrument_id = data.customerPaymentId;
  }
  if (data.id) {
    result.customer_payment_instrument_id = data.id;
  }
  if (data.giftCertificateCode) {
    result.gift_certificate_code = data.giftCertificateCode;
  }
  if (data.paymentBankAccount) {
    result.payment_bank_account = paymentBankAccount(data.paymentBankAccount);
  }
  if (data.paymentCard) {
    result.payment_card = paymentCard(data.paymentCard);
  }
  if (data.paymentMethodId) {
    result.payment_method_id = data.paymentMethodId;
  }
  return result;
}

function paymentMethod(
  data: FSCommerceTypes.PaymentMethod
): SFCC.CustomerPaymentInstrumentRequest | null {
  if (!data) {
    return null;
  }
  const result: SFCC.CustomerPaymentInstrumentRequest = {};
  if (data.bankRoutingNumber) {
    result.bank_routing_number = data.bankRoutingNumber;
  }
  if (data.id) {
    result.payment_method_id = data.id;
  }
  if (data.giftCertificateCode) {
    result.gift_certificate_code = data.giftCertificateCode;
  }
  if (data.paymentBankAccount) {
    result.payment_bank_account = paymentBankAccount(data.paymentBankAccount);
  }
  if (data.paymentCard) {
    result.payment_card = paymentCard(data.paymentCard);
  }
  if (data.paymentMethodId) {
    result.payment_method_id = data.paymentMethodId;
  }
  return result;
}

function giftOptions(data: FSCommerceTypes.GiftOptions): Partial<SFCC.Shipment> | null {
  if (!data) {
    return null;
  }
  return {
    gift: data.gift,
    gift_message: data.giftMessage,
    shipment_id: data.shipmentId
  };
}

function updateOrder(data: Partial<FSCommerceTypes.Order>): Partial<SFCC.Order> | null {
  const { status } = data;

  if (!status || ORDER_STATUSES.indexOf(status) === -1) {
    return null;
  }

  return {
    status: status as ValidOrderStatus
  };
}

/**
 * Converts a ProductQuery object into a format appropriate for querying products
 * in Demandware.
 *
 * @param {ProductQuery} query - The query to format for use in Demandware
 * @returns {DemandwareProductQuery} The query formatted for use in Demandware
 */
function productQuery(query: FSCommerceTypes.ProductQuery): DemandwareProductQuery {
  const refinements: any = query.refinements ? { ...query.refinements } : {};
  const options: DemandwareProductQuery = {};

  if (query.categoryId && !refinements.cgid) {
    refinements.cgid = query.categoryId;
  }

  // TODO: handle sort/filter/pagination with query
  serializeRefinements(refinements).forEach((value, i) => {
    options[`refine_${i + 1}`] = value;
  });

  if (query.limit) {
    options.count = query.limit;
  } else {
    options.count = 24;
  }

  if (query.page) {
    options.start = (query.page - 1) * options.count;
  }

  if (query.keyword) {
    options.q = query.keyword;
  }

  if (query.sortBy) {
    options.sort = query.sortBy;
  }

  return options;

}

/**
 * Serialize a refinement object into an array of strings that can be passed to a
 * Demandware product query.
 *
 * @param {Object} refinements - The refinements to be serialized
 * @returns {Array.<string>} An array of serialized refinements
 */
function serializeRefinements(refinements: any = {}): string[] {
  return Object.keys(refinements).map((key, index) => {
    let value = refinements[key];

    if (key === 'priceRange') {
      value = serializePrice(refinements[key]);
    } else if (Array.isArray(value)) {
      value = value.join('|');
    }

    return `${key}=${value}`;
  });
}

/**
 * Serialize a price range into a string that can be passed to a Demandware
 * product query.
 *
 * @param {PriceRange} range - The price range to be serialized
 * @returns {string} The serialized price range
 */
function serializePrice(range: PriceRange): string {
  if (range.min > range.max) {
    return `(${range.max}..${range.min})`;
  } else {
    return `(${range.min}..${range.max})`;
  }
}

export default {
  address,
  customerAddress,
  giftOptions,
  paymentBankAccount,
  paymentCard,
  payment,
  paymentMethod,
  productQuery,
  serializeRefinements,
  serializePrice,
  updateOrder
};
