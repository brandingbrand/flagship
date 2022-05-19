import React from 'react';

import { FlatList } from 'react-native';

import { action } from '@storybook/addon-actions';
import { boolean, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { CategoryBox } from '../src/components/CategoryBox';
import { CategoryLine } from '../src/components/CategoryLine';
import { Grid } from '../src/components/Grid';

import arrowRight from './assets/images/arrow-right.png';
import greyBox from './assets/images/greyBox.png';

const boxImageStyle = {
  width: 60,
  height: 60,
};

const defaultAccessoryStyle = {
  width: 30,
  height: 30,
};

const defaultStyle = {
  padding: 15,
};

const kActionOnPress = 'CategoryLine onPress';

const lineImageStyle = {
  width: 50,
  height: 50,
};

const renderCategoryBox = (): JSX.Element => (
  <CategoryBox
    id="123"
    image={greyBox as any}
    imageStyle={object('imageStyle', boxImageStyle)}
    onPress={action('CategoryBox onPress')}
    showImage={boolean('thumbnail?', true)}
    style={object('style', defaultStyle)}
    title={text('title', 'Category')}
  />
);

const renderCategoryLine = (): JSX.Element => (
  <CategoryLine
    accessorySrc={arrowRight}
    accessoryStyle={object('accessoryStyle', defaultAccessoryStyle)}
    id="123"
    image={greyBox as any}
    imageStyle={object('imageStyle', lineImageStyle)}
    onPress={action(kActionOnPress)}
    showAccessory={boolean('accessory?', true)}
    showImage={boolean('thumbnail?', true)}
    style={object('style', defaultStyle)}
    title={text('title', 'Category')}
  />
);

storiesOf('Category', module)
  .add('Category Box', () => (
    <Grid
      columns={select('number of columns', [1, 2, 3], 2)}
      data={[...Array.from({ length: 6 }).keys()]}
      renderItem={renderCategoryBox}
    />
  ))
  .add('Category Line', renderCategoryLine)
  .add('Category Line in FlatList', () => (
    <FlatList data={[1, 2, 3]} renderItem={renderCategoryLine} />
  ));
