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
import {
  Image,
  ListRenderItem,
  StyleSheet,
  View
} from 'react-native';

const productItems = [...Array(9)].map((a, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  image: `https://via.placeholder.com/100/${i}F${i}F${i}F`
}));

const imageItems = [...Array(3)].map((a, i) => ({
  id: i,
  title: '',
  image: `https://via.placeholder.com/300/${i}F${i}F${i}F`
}));


const imageStyle = StyleSheet.create({
  image: {
    width: 300,
    height: 300
  },
  container: {
    alignItems: 'center'
  }
});

const style = StyleSheet.create({
  imageStyle: {
    width: 100,
    height: 100
  },
  contentStyle: {
    alignItems: 'center'
  }
});


const renderItem: ListRenderItem<typeof productItems[number]> = ({ item }) => {
  return (
    <ProductItem
      id={`${item.id}`}
      handle={item.title}
      title={item.title}
      image={{ uri: item.image }}
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

const renderImage: ListRenderItem<typeof imageItems[number]> = ({ item }) => {
  return (
    <View style={imageStyle.container}>
      <Image
        source={{uri: item.image}}
        style={imageStyle.image}
      />
    </View>
  );
};

// TODO: Update MultiCarousel to support prop switching
storiesOf('MultiCarousel', module)
  .add('basic usage', () => (
    <MultiCarousel
      data={productItems}
      renderItem={renderItem}
      itemsPerPage={number('itemsPerPage', 3)}
      showArrow={boolean('arrow?', true)}
    />
  ))
  .add('Image Carousel', () => (
    <MultiCarousel
      data={imageItems}
      renderItem={renderImage}
      itemsPerPage={number('itemsPerPage', 1)}
      autoplay={true}
      autoplayTimeoutDuration={3000}
      showArrow={boolean('arrow?', true)}
    />
  ));
