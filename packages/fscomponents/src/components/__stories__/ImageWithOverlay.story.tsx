/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  files,
  object,
  select
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { ImageWithOverlay } from '../ImageWithOverlay';

const defaultImageStyle = {
  width: 375,
  height: 200
};

const positions = [
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
  'centerLeft',
  'center',
  'centerRight',
  'topLeft',
  'topCenter',
  'topRight'
];

const overlay = <Text style={{fontSize: 30, fontWeight: 'bold'}}>Text Overlay</Text>;

storiesOf('ImageWithOverlay', module)
  .add('basic usage', () => {
    const label = 'Images';
    const accept = '.xlsx, .pdf, .png, .jpg, jpeg';
    const defaultValue = ['https://placehold.it/375x150'];
    const value = files(label, accept, defaultValue);
    const styles = object('imageStyle', defaultImageStyle);
    return (
      <ImageWithOverlay
        imageProps={{
          source: {uri: value[0]},
          style: {...styles}
        }}
        overlay={overlay}
        overlayPosition={select('overlayPosition', positions, 'topRight') as any}
      />
    );
  });
