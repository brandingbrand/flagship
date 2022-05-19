// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import { boolean, number, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Carousel } from '../src/components/Carousel';

const style = StyleSheet.create({
  slide: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  slideImage: {
    alignItems: 'center',
    height: 150,
    justifyContent: 'center',
    width: 375,
  },
});

const imageSlide = (
  <Image
    source={{ uri: 'https://via.placeholder.com/375x150' }}
    style={object('slideImageStyle', style.slideImage)}
  />
);

const textSlide = (
  <View style={[object('textSlideStyle', { backgroundColor: '#f83' }), style.slide]}>
    <Text>Text Slide</Text>
  </View>
);

storiesOf('Carousel', module)
  .add('basic usage', () => (
    <Carousel height={number('Height', 190)} showsPagination={boolean('showsPagination', true)}>
      {imageSlide}
      {imageSlide}
      {imageSlide}
    </Carousel>
  ))
  .add('looping', () => (
    <Carousel height={number('Height', 250)} loop={boolean('loop', true)}>
      {textSlide}
      {textSlide}
      {textSlide}
    </Carousel>
  ))
  .add('empty', () => <Carousel height={190} />);
