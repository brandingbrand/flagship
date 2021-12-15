import React from 'react';
import { storiesOf } from '@storybook/react';
import { object, text } from '@storybook/addon-knobs';
import { ReviewTypes } from '@brandingbrand/fscommerce';
import { ProductMetadata } from '../src/components/ProductMetadata';
import Decimal from 'decimal.js';

const defaultReview: ReviewTypes.ReviewDetails = {
  id: '1',
  statistics: {
    id: '1',
    averageRating: 4.5,
    reviewCount: 20,
  },
  reviews: [],
};

storiesOf('ProductMetadata', module).add('basic usage', () => (
  <ProductMetadata
    id="1"
    style={{ padding: 20 }}
    brand={text('brand', 'Branding Brand')}
    title={text('title', 'Product Name')}
    originalPrice={object('originalPrice', {
      value: new Decimal('2.75'),
      currencyCode: 'USD',
    })}
    price={object('price', {
      value: new Decimal('2.00'),
      currencyCode: 'USD',
    })}
    review={defaultReview}
  />
));
