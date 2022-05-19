import React from 'react';

import { boolean, number, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ZoomCarousel } from '../src/components/ZoomCarousel/ZoomCarousel';

import wide from './assets/images/wide.png';
import wide2x from './assets/images/wide@2x.png';

const defaultImages = [
  {
    src: wide,
    zoomSrc: wide2x,
  },
  {
    src: wide,
    zoomSrc: wide2x,
  },
  {
    src: wide,
    zoomSrc: wide2x,
  },
  {
    src: wide,
    zoomSrc: wide2x,
  },
];

storiesOf('ZoomCarousel', module)
  .add('basic usage', () => (
    <ZoomCarousel
      centerMode={boolean('Center Mode', true)}
      fillContainer={boolean('Fill Container', false)}
      gapSize={number('Gap Size', 10)}
      hideZoomButton={boolean('Hide Zoom Button', false)}
      images={object('Images', defaultImages)}
      peekSize={number('Peek Size', 20)}
      showArrow={boolean('Show Arrow', true)}
    />
  ))
  .add('with thumbnails', () => (
    <ZoomCarousel
      centerMode={boolean('Center Mode', true)}
      fillContainer={boolean('Fill Container', false)}
      gapSize={number('Gap Size', 10)}
      hideZoomButton={boolean('Hide Zoom Button', false)}
      images={object('Images', defaultImages)}
      peekSize={number('Peek Size', 20)}
      showArrow={boolean('Show Arrow', true)}
      showThumbnails={boolean('Show Thumbnails', true)}
    />
  ))
  .add('with image counter', () => (
    <ZoomCarousel
      centerMode={boolean('Center Mode', true)}
      fillContainer={boolean('Fill Container', false)}
      gapSize={number('Gap Size', 10)}
      hideZoomButton={boolean('Hide Zoom Button', false)}
      images={object('Images', defaultImages)}
      peekSize={number('Peek Size', 20)}
      showArrow={boolean('Show Arrow', true)}
      showImageCounter={boolean('Show Image Counter', true)}
      showThumbnails={boolean('Show Thumbnails', true)}
    />
  ))
  .add('without horizontal overflow', () => (
    <ZoomCarousel
      centerMode={boolean('Center Mode', true)}
      fillContainer={boolean('Fill Container', false)}
      gapSize={number('Gap Size', 10)}
      hideOverflow
      hideZoomButton={boolean('Hide Zoom Button', false)}
      images={object('Images', defaultImages)}
      peekSize={number('Peek Size', 20)}
      showArrow={boolean('Show Arrow', true)}
    />
  ));
