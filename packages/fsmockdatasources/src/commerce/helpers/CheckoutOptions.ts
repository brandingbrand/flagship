import Decimal from 'decimal.js';
import { DefaultCurrencyCode } from './Misc';

type ApplicablePayments = import ('@brandingbrand/fscommerce').CommerceTypes.ApplicablePayment[];
type ShippingMethods = import ('@brandingbrand/fscommerce').CommerceTypes.ShippingMethod[];
export const PaymentMethods: ApplicablePayments = [
  {
    id: 'VISA',
    name: 'Visa',
    cards: [{
      cardType: 'VISA',
      name: 'Visa'
    }]
  }, {
    id: 'MASTERCARD',
    name: 'Mastercard',
    cards: [{
      cardType: 'MASTERCARD',
      name: 'Mastercard'
    }]
  }
];

export const ShippingMethods: ShippingMethods = [
  {
    id: 'ground',
    name: 'Ground',
    price: {
      currencyCode: DefaultCurrencyCode,
      value: new Decimal(0.99)
    }
  }, {
    id: 'two-day',
    name: 'Two Day',
    price: {
      currencyCode: DefaultCurrencyCode,
      value: new Decimal(10.99)
    }
  }
];

export const DefaultShippingMethod = ShippingMethods[0];
