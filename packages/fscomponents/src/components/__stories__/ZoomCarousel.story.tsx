import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { ZoomCarousel } from '../ZoomCarousel/ZoomCarousel';

const images = [
  {
    src: require('./assets/images/wide.png'),
    zoomSrc: require('./assets/images/wide@2x.png')
  },
  {
    src: require('./assets/images/wide.png'),
    zoomSrc: require('./assets/images/wide@2x.png')
  },
  {
    src: require('./assets/images/wide.png'),
    zoomSrc: require('./assets/images/wide@2x.png')
  },
  {
    src: require('./assets/images/wide.png'),
    zoomSrc: require('./assets/images/wide@2x.png')
  }
];

storiesOf('ZoomCarousel', module)
  .add('basic usage', () => (
    <ZoomCarousel
      peekSize={20}
      gapSize={10}
      centerMode={true}
      showThumbnails={true}
      images={images}
      showArrow={true}
    />
  )).add('fill container', () => (
    <ZoomCarousel
      peekSize={20}
      gapSize={10}
      centerMode={true}
      showThumbnails={true}
      images={images}
      showArrow={true}
      fillContainer={true}
    />
  )).add('custom fill container', () => (
    <ZoomCarousel
      peekSize={20}
      gapSize={10}
      centerMode={true}
      showThumbnails={true}
      images={images}
      showArrow={true}
      fillContainer={true}
      fillContainerStyle={{height: '75%'}}
    />
  ));
