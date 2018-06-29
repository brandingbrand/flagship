import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { CategoryBox } from '../CategoryBox';
import { Grid } from '../Grid';

const greyBox = require('./assets/images/greyBox.png');

const defaultStyle = {
  padding: 15
};

const defaultImageStyle = {
  width: 60,
  height: 60
};

const renderCategory = (): JSX.Element => {
  return (
    <CategoryBox
      id={'123'}
      title={text('title', 'Category')}
      style={object('style', defaultStyle)}
      onPress={action('CategoryBox onPress')}
      image={greyBox}
      imageStyle={object('imageStyle', defaultImageStyle)}
    />
  );
};

storiesOf('CategoryBox', module)
  .add('basic usage', () => (
    <CategoryBox
      id={'123'}
      title={text('title', 'Category')}
      style={object('style', defaultStyle)}
      onPress={action('CategoryBox onPress')}
    />
  ))
  .add('w/ image', renderCategory)
  .add('in grid', () => (
    <Grid
      data={[...Array(6).keys()]}
      columns={number('columns', 2)}
      renderItem={renderCategory}
    />
  ));
