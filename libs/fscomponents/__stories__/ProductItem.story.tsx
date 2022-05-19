import React from 'react';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { action } from '@storybook/addon-actions';
import { boolean, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Decimal from 'decimal.js';

import { ProductItem } from '../src/components/ProductItem';
import type { SwatchItemType } from '../src/components/Swatches';

const kActionOnPress = 'ProductItemVerticalList onPress';

const defaultStyle = {
  padding: 15,
};

const testProduct: CommerceTypes.Product = {
  id: '101',
  brand: 'Brand Name',
  title: 'Product Title',
  price: {
    value: new Decimal('100.00'),
    currencyCode: 'USD',
  },
  originalPrice: {
    value: new Decimal('200.00'),
    currencyCode: 'USD',
  },
  images: [{ uri: 'https://placehold.it/345x200?text=%20' }],
  review: {
    id: '101',
    statistics: {
      id: '101',
      averageRating: 3.5,
      reviewCount: 20,
    },
    reviews: [],
  },
  promotions: ['Free Shipping', 'Buy One, Get One Free'],
};

const testSwatches: SwatchItemType[] = [
  { color: '#00beac', name: 'turquoise', value: 'Turquoise' },
  { color: '#bf3a41', name: 'dustyRed', value: 'Red' },
  { color: '#c79300', name: 'ocre', value: 'Ocre' },
  { color: '#5c8cb3', name: 'offBlue', value: 'Blue' },
  { color: '#e0e1e2', name: 'silver', value: 'Orange', available: false },
];

const orientations = ['vertical', 'horizontal'];

storiesOf('ProductItem', module)
  .add('Horizontal', () => (
    <ProductItem
      {...object('Product', testProduct)}
      buttonText={text('buttonText', 'Add to Cart')}
      hideBrand={boolean('hideBrand', false)}
      hideButton={boolean('hideButton', false)}
      hideImage={boolean('hideImage', false)}
      hidePrice={boolean('hidePrice', false)}
      hidePromos={boolean('hidePromos', false)}
      hideReviews={boolean('hideReviews', false)}
      hideSwatches={boolean('hideSwatches', false)}
      hideTitle={boolean('hideTitle', false)}
      hideVariantText={boolean('hideVariantText', false)}
      onButtonPress={action('ProductItemVerticalAction onButtonPress')}
      onPress={action(kActionOnPress)}
      orientation={select('orientation', orientations, 'horizontal') as any}
      style={object('style', defaultStyle)}
      swatchItems={object('swatchItems', testSwatches)}
    />
  ))
  .add('Vertical', () => (
    <ProductItem
      {...object('Product', testProduct)}
      buttonText={text('buttonText', 'Add to Cart')}
      contentStyle={{ alignItems: 'center' }}
      hideBrand={boolean('hideBrand', false)}
      hideButton={boolean('hideButton', false)}
      hideImage={boolean('hideImage', false)}
      hidePrice={boolean('hidePrice', false)}
      hidePromos={boolean('hidePromos', false)}
      hideReviews={boolean('hideReviews', false)}
      hideSwatches={boolean('hideSwatches', false)}
      hideTitle={boolean('hideTitle', false)}
      hideVariantText={boolean('hideVariantText', false)}
      onButtonPress={action('ProductItemVerticalAction onButtonPress')}
      onPress={action(kActionOnPress)}
      orientation={select('orientation', orientations, 'vertical') as any}
      promoContainerStyle={{ alignItems: 'center' }}
      style={object('style', defaultStyle)}
      swatchItems={object('swatchItems', testSwatches)}
    />
  ));
