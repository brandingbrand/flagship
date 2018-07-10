import React from 'react';
import { FlatList } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  object,
  select,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { CategoryBox } from '../CategoryBox';
import { CategoryLine } from '../CategoryLine';
import { Grid } from '../Grid';

const arrowRight = require('./assets/images/arrow-right.png');

const boxImageStyle = {
  width: 60,
  height: 60
};

const defaultAccessoryStyle = {
  width: 30,
  height: 30
};

const defaultStyle = {
  padding: 15
};

const greyBox = require('./assets/images/greyBox.png');

const kActionOnPress = 'CategoryLine onPress';

const lineImageStyle = {
  width: 50,
  height: 50
};

const renderCategoryBox = (): JSX.Element => {
  return (
    <CategoryBox
      id={'123'}
      title={text('title', 'Category')}
      style={object('style', defaultStyle)}
      onPress={action('CategoryBox onPress')}
      image={greyBox}
      showImage={boolean('thumbnail?', true)}
      imageStyle={object('imageStyle', boxImageStyle)}
    />
  );
};

const renderCategoryLine = (): JSX.Element => {
  return (
    <CategoryLine
      id={'123'}
      title={text('title', 'Category')}
      style={object('style', defaultStyle)}
      onPress={action(kActionOnPress)}
      image={greyBox}
      showImage={boolean('thumbnail?', true)}
      imageStyle={object('imageStyle', lineImageStyle)}
      showAccessory={boolean('accessory?', true)}
      accessorySrc={arrowRight}
      accessoryStyle={object('accessoryStyle', defaultAccessoryStyle)}
    />
  );
};

storiesOf('Category', module)
  .add('Category Box', () => (
    <Grid
      renderItem={renderCategoryBox}
      data={[...Array(6).keys()]}
      columns={select('number of columns', [1, 2, 3], 2)}
    />
  ))
  .add('Category Line', renderCategoryLine)
  .add('Category Line in FlatList', () => (
    <FlatList
      renderItem={renderCategoryLine}
      data={[1, 2, 3]}
    />
  ));
