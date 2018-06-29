import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { SwatchItemType } from '../Swatches';
import { ProductItemHorizontalGrid } from '../ProductItem/ProductItemHorizontalGrid';
import { ProductItemHorizontalList } from '../ProductItem/ProductItemHorizontalList';
import { ProductItemVerticalAction } from '../ProductItem/ProductItemVerticalAction';
import {
  ProductItemVerticalBottomSwatches
} from '../ProductItem/ProductItemVerticalBottomSwatches';
import { ProductItemVerticalFavorite } from '../ProductItem/ProductItemVerticalFavorite';
import { ProductItemVerticalList } from '../ProductItem/ProductItemVerticalList';
import { ProductItemVerticalReviews } from '../ProductItem/ProductItemVerticalReviews';
import { ProductItemVerticalTopSwatches } from '../ProductItem/ProductItemVerticalTopSwatches';
import Decimal from 'decimal.js';

const kActionOnPress = 'ProductItemVerticalList onPress';

const defaultStyle = {
  padding: 15
};

const testProduct: CommerceTypes.Product = {
  id: '101',
  brand: 'Brand',
  title: 'Product',
  price: {
    value: new Decimal('9.99'),
    currencyCode: 'USD'
  },
  originalPrice: {
    value: new Decimal('14.99'),
    currencyCode: 'USD'
  },
  images: [{ uri: require('./assets/images/greyBox.png') }],
  review: {
    id: '101',
    statistics: {
      id: '101',
      averageRating: 4.5,
      reviewCount: 20
    },
    reviews: []
  },
  promotions: ['This is a sample promotion!']
};

const testSwatches: SwatchItemType[] = [
  { color: 'red', name: 'red', value: 'Red' },
  { color: 'green', name: 'green', value: 'Green' },
  { color: 'blue', name: 'blue', value: 'Blue' },
  { color: 'yellow', name: 'yellow', value: 'Yellow' },
  { color: 'orange', name: 'orange', value: 'Orange', available: false },
  { color: 'black', name: 'black', value: 'Black', available: false }
];

storiesOf('ProductItem', module)
  .add('ProductItemHorizontalGrid', () => (
    <ProductItemHorizontalGrid
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
    />
  ))
  .add('ProductItemHorizontalList', () => (
    <ProductItemHorizontalList
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
    />
  ))
  .add('ProductItemVerticalAction', () => (
    <ProductItemVerticalAction
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
      buttonText={text('buttonText', 'Action')}
      onButtonPress={action('ProductItemVerticalList onButtonPress')}
      swatchItems={object('swatchItems', testSwatches)}
    />
  ))
  .add('ProductItemVerticalBottomSwatches', () => (
    <ProductItemVerticalBottomSwatches
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
      swatchItems={object('swatchItems', testSwatches)}
    />
  ))
  .add('ProductItemVerticalFavorite', () => (
    <ProductItemVerticalFavorite
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
      onFavButtonPress={action('ProductItemVerticalList onFavButtonPress')}
      swatchItems={object('swatchItems', testSwatches)}
    />
  ))
  .add('ProductItemVerticalList', () => (
    <ProductItemVerticalList
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
    />
  ))
  .add('ProductItemVerticalReviews', () => (
    <ProductItemVerticalReviews
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
    />
  ))
  .add('ProductItemVerticalTopSwatches', () => (
    <ProductItemVerticalTopSwatches
      {...object('Product', testProduct)}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
      swatchItems={object('swatchItems', testSwatches)}
    />
  ));
