import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { CategoryLine } from '../CategoryLine';

const greyBox = require('./assets/images/greyBox.png');
const arrowRight = require('./assets/images/arrow-right.png');

const kActionOnPress = 'CategoryLine onPress';

const defaultStyle = {
  padding: 15
};

const defaultImageStyle = {
  width: 50,
  height: 50
};

const defaultAccessoryStyle = {
  width: 30,
  height: 30
};

storiesOf('CategoryLine', module)
  .add('basic usage', () => (
    <CategoryLine
      id={'123'}
      title={text('title', 'Category')}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
    />
  ))
  .add('w/ image', () => (
    <CategoryLine
      id={'123'}
      title={text('title', 'Category')}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
      image={greyBox}
      imageStyle={object('imageStyle', defaultImageStyle)}
    />
  ))
  .add('w/ accessory', () => (
    <CategoryLine
      id={'123'}
      title={text('title', 'Category')}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
      accessorySrc={arrowRight}
      accessoryStyle={object('accessoryStyle', defaultAccessoryStyle)}
    />
  ));
