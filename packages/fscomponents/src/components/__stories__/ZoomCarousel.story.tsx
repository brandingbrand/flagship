import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { ZoomCarousel } from '../ZoomCarousel/ZoomCarousel';
// tslint:disable-next-line:no-implicit-dependencies
import { boolean, number, object } from '@storybook/addon-knobs';

const defaultImages = [
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
      images={object('Images', defaultImages)}
      peekSize={number('Peek Size', 20)}
      gapSize={number('Gap Size', 10)}
      centerMode={boolean('Center Mode', true)}
      showThumbnails={boolean('Show Thumbnails', true)}
      showArrow={boolean('Show Arrow', true)}
      hideZoomButton={boolean('Hide Zoom Button', false)}
      fillContainer={boolean('Fill Container', false)}
    />
  ));
