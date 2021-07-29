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
  boolean,
  number, object
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';

import { Carousel } from '../Carousel';

const style = StyleSheet.create({
  slide: {
    flex: 1,
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
    style={object('slideImageStyle', style.slideImage)}
  />
);

const textSlide = (
  <View style={[object('textSlideStyle', {backgroundColor: '#f83'}), style.slide]}>
    <Text>Text Slide</Text>
  </View>
);

storiesOf('Carousel', module)
  .add('basic usage', () => (
    <Carousel
      height={number('Height', 190)}
      showsPagination={boolean('showsPagination', true)}
    >
      {imageSlide}
      {imageSlide}
      {imageSlide}
    </Carousel>
  ))
  .add('looping', () => (
    <Carousel
      height={number('Height', 250)}
      loop={boolean('loop', true)}
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
