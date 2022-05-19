import React from 'react';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Decimal from 'decimal.js';

import { Price } from '../src/components/Price';

type SerializedPrice = Omit<CommerceTypes.CurrencyValue, 'value'> & { value: string };

const convertToCurrency = (priceToConvert: SerializedPrice) => ({
  ...priceToConvert,
  value: new Decimal(priceToConvert.value),
});

const price: SerializedPrice = {
  value: '100.00',
  currencyCode: 'USD',
};
const originalPrice: SerializedPrice = {
  value: '200.00',
  currencyCode: 'USD',
};

storiesOf('Price', module).add('basic usage', () => (
  <Price
    originalPrice={convertToCurrency(object('Original Price', originalPrice))}
    originalPriceFirst={boolean('Show Original Price First', false)}
    originalPriceStyle={object('Original Price Style', undefined)}
    price={convertToCurrency(object('Price', price))}
    priceStyle={object('Price Style', undefined)}
    salePriceStyle={object('Sale Price Style', undefined)}
  />
));
