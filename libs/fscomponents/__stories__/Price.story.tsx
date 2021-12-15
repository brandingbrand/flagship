import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';
import { Price } from '../src/components/Price';
import Decimal from 'decimal.js';
import { CommerceTypes } from '@brandingbrand/fscommerce';

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
    price={convertToCurrency(object('Price', price))}
    originalPrice={convertToCurrency(object('Original Price', originalPrice))}
    originalPriceFirst={boolean('Show Original Price First', false)}
    priceStyle={object('Price Style', undefined)}
    originalPriceStyle={object('Original Price Style', undefined)}
    salePriceStyle={object('Sale Price Style', undefined)}
  />
));
