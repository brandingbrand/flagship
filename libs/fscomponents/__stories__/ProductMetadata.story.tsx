import React from 'react';

import type { ReviewTypes } from '@brandingbrand/fscommerce';

import { object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Decimal from 'decimal.js';

import { ProductMetadata } from '../src/components/ProductMetadata';

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
    brand={text('brand', 'Branding Brand')}
    id="1"
    originalPrice={object('originalPrice', {
      value: new Decimal('2.75'),
      currencyCode: 'USD',
    })}
    price={object('price', {
      value: new Decimal('2.00'),
      currencyCode: 'USD',
    })}
    review={defaultReview}
    style={{ padding: 20 }}
    title={text('title', 'Product Name')}
  />
));
