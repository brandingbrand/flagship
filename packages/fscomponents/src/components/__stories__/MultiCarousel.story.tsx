import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { MultiCarousel } from '../MultiCarousel';
import { ProductItem } from '../ProductItem';
import Decimal from 'decimal.js';
import {
  boolean, number, object
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { StyleSheet } from 'react-native';

const productItems = [...Array(10)].map((a, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  image: 'https://placehold.it/100x100'
}));

const style = StyleSheet.create({
  imageStyle: {
    width: 100,
    height: 100
  },
  contentStyle: {
    alignItems: 'center'
  }
});


const renderItem = (item: any) => {
  return (
    <ProductItem
      id={item.id}
      handle={item.title}
      title={item.title}
      image={item.image}
      imageStyle={object('imageStyle', style.imageStyle)}
      contentStyle={object('contentStyle', style.contentStyle)}
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
      itemsPerPage={number('itemsPerPage', 3)}
      showArrow={boolean('arrow?', true)}
    />
  ));
