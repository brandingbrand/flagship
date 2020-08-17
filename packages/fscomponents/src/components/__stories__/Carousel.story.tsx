/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';

import { Carousel } from '../Carousel';

const style = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#f83',
    justifyContent: 'center',
    alignItems: 'center'
  },
  slideImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 375,
    height: 150
  }
});

const imageSlide = (
  <Image
    source={{ uri: 'https://placehold.it/375x150' }}
    style={style.slideImage}
  />
);

const textSlide = (
  <View style={style.slide}>
    <Text>Text Slide</Text>
  </View>
);

storiesOf('Carousel', module)
  .add('basic usage', () => (
    <Carousel
      height={190}
      showsPagination={boolean('showsPagination', true)}
    >
      {imageSlide}
      {imageSlide}
      {imageSlide}
    </Carousel>
  ))
  .add('looping', () => (
    <Carousel
      height={250}
      loop={true}
    >
      {textSlide}
      {textSlide}
      {textSlide}
    </Carousel>
  ))
  .add('empty', () => (
    <Carousel
      height={190}
    />
  ));
