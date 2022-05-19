import React from 'react';

import type { ListRenderItem } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

import { action } from '@storybook/addon-actions';
import { boolean, number, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Decimal from 'decimal.js';

import { MultiCarousel } from '../src/components/MultiCarousel';
import { ProductItem } from '../src/components/ProductItem';

const productItems = [...Array.from({ length: 9 })].map((a, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  image: `https://via.placeholder.com/100/${i}F${i}F${i}F`,
}));

const imageItems = [...Array.from({ length: 3 })].map((a, i) => ({
  id: i,
  title: '',
  image: `https://via.placeholder.com/300/${i}F${i}F${i}F`,
}));

const imageStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    height: 300,
    width: 300,
  },
});

const style = StyleSheet.create({
  contentStyle: {
    alignItems: 'center',
  },
  imageStyle: {
    height: 100,
    width: 100,
  },
});

const renderItem: ListRenderItem<typeof productItems[number]> = ({ item }) => (
  <ProductItem
    contentStyle={object('contentStyle', style.contentStyle)}
    handle={item.title}
    id={`${item.id}`}
    image={{ uri: item.image }}
    imageStyle={object('imageStyle', style.imageStyle)}
    onPress={action('MultiCarousel ProductItem onPress')}
    price={{
      value: new Decimal('5.95'),
      currencyCode: 'USD',
    }}
    title={item.title}
  />
);

const renderImage: ListRenderItem<typeof imageItems[number]> = ({ item }) => (
  <View style={imageStyle.container}>
    <Image source={{ uri: item.image }} style={imageStyle.image} />
  </View>
);

// TODO: Update MultiCarousel to support prop switching
storiesOf('MultiCarousel', module)
  .add('basic usage', () => (
    <MultiCarousel
      data={productItems}
      itemsPerPage={number('itemsPerPage', 3)}
      renderItem={renderItem}
      showArrow={boolean('arrow?', true)}
    />
  ))
  .add('Image Carousel Autoplay', () => (
    <MultiCarousel
      autoplay
      autoplayTimeoutDuration={1000}
      data={imageItems}
      itemsPerPage={number('itemsPerPage', 1)}
      renderItem={renderImage}
      showArrow={boolean('arrow?', true)}
    />
  ))
  .add('Image Carousel No Autoplay', () => (
    <MultiCarousel
      autoplay={false}
      autoplayTimeoutDuration={1000}
      data={imageItems}
      itemsPerPage={number('itemsPerPage', 1)}
      renderItem={renderImage}
      showArrow={boolean('arrow?', true)}
    />
  ));
