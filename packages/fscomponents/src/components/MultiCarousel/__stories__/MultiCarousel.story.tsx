import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { MultiCarousel } from '../MultiCarousel';
import { ProductItemVerticalList } from '../../ProductItem/ProductItemVerticalList';
import Decimal from 'decimal.js';

const productItems = [...Array(10)].map((a, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  image: 'https://placehold.it/100x100'
}));

const renderItem = (item: any) => {
  return (
    <ProductItemVerticalList
      id={item.id}
      handle={item.title}
      title={item.title}
      image={item.image}
      imageStyle={{ width: 100, height: 100 }}
      contentStyle={{ alignItems: 'center' }}
      price={{
        value: new Decimal('5.95'),
        currencyCode: 'USD'
      }}
      onPress={action('MultiCarousel ProductItem onPress')}
    />
  );
};

// TODO: Update MultiCarousel to support prop switching
storiesOf('MultiCarousel', module)
  .add('basic usage', () => (
    <MultiCarousel
      items={productItems}
      renderItem={renderItem}
      itemsPerPage={3}
      showArrow={true}
    />
  ));
