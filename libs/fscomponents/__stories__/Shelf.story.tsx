import React from 'react';

import type { CommerceTypes } from '@brandingbrand/fscommerce';
import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Decimal from 'decimal.js';

import { Grid } from '../src/components/Grid';
import { ProductItem } from '../src/components/ProductItem';
import { Shelf } from '../src/components/Shelf';

import greyBox from './assets/images/greyBox.png';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1,
});

const defaultStyle = {
  padding: 15,
  font: 8,
  textAlign: 'center',
};

const kActionOnPress = 'ProductItemVerticalList onPress';

const testProduct: CommerceTypes.Product = {
  id: '101',
  brand: 'Brand',
  title: 'Product',
  price: {
    value: new Decimal('9.99'),
    currencyCode: 'USD',
  },
  originalPrice: {
    value: new Decimal('14.99'),
    currencyCode: 'USD',
  },
  images: [{ uri: greyBox } as any],
  review: {
    id: '101',
    statistics: {
      id: '101',
      averageRating: 4.5,
      reviewCount: 20,
    },
    reviews: [],
  },
  promotions: ['This is a sample promotion!'],
};

const renderProduct = (): JSX.Element => (
  <ProductItem
    {...object('Product', testProduct)}
    onPress={action(kActionOnPress)}
    style={object('style', defaultStyle)}
  />
);

storiesOf('Shelf', module).add('basic usage', () => (
  <Shelf carouselHeight={100} group="Shop" identifier="Banner-Carousel" provider={provider}>
    <Grid columns={2} data={[...Array.from({ length: 4 }).keys()]} renderItem={renderProduct} />
  </Shelf>
));
