import type { CommerceTypes } from '@brandingbrand/fscommerce';

import Decimal from 'decimal.js';

import { DefaultCurrencyCode } from './Misc';

type ApplicablePayments = CommerceTypes.ApplicablePayment[];
type ShippingMethods = CommerceTypes.ShippingMethod[];
export const PaymentMethods: ApplicablePayments = [
  {
    id: 'VISA',
    name: 'Visa',
    cards: [
      {
        cardType: 'VISA',
        name: 'Visa',
      },
    ],
  },
  {
    id: 'MASTERCARD',
    name: 'Mastercard',
    cards: [
      {
        cardType: 'MASTERCARD',
        name: 'Mastercard',
      },
    ],
  },
];

const defaultShippingMethod = {
  id: 'ground',
  name: 'Ground',
  price: {
    currencyCode: DefaultCurrencyCode,
    value: new Decimal(0.99),
  },
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ShippingMethods: ShippingMethods = [
  defaultShippingMethod,
  {
    id: 'two-day',
    name: 'Two Day',
    price: {
      currencyCode: DefaultCurrencyCode,
      value: new Decimal(10.99),
    },
  },
];

export const DefaultShippingMethod = defaultShippingMethod;
