import React from 'react';
import { StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  number,
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { Swatches } from '../Swatches';

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  label: {
    padding: 0
  }
});

const swatchSize = 25;
const maxSwatches = 6;
const title = 'Selected';
const items = [
  { color: 'red', name: 'red', value: 'red' },
  { color: 'green', name: 'green', value: 'green' },
  { color: 'blue', name: 'blue', value: 'blue' },
  { color: 'red', name: 'red', value: 'red2' },
  { color: 'green', name: 'green', value: 'green2' },
  { color: 'blue', name: 'blue', value: 'blue2' },
  { color: 'red', name: 'red', value: 'red3', available: false },
  { color: 'green', name: 'green', value: 'green3', available: false },
  { color: 'blue', name: 'blue', value: 'blue3', available: false }
];

storiesOf('Swatches', module)
  .add('basic usage', () => (
    <Swatches
      label={boolean('label', true)}
      title={text('title', title)}
      moreLessStyle={{ display: boolean('showMoreLess', false) ? 'flex' : 'none'}}
      maxSwatches={number('maxSwatches', maxSwatches)}
      colorContainerStyle={{
        height: number('swatchSize', swatchSize),
        width: number('swatchSize', swatchSize)
      }}
      labelTitleStyle={object('labelStyle', styles.label)}
      style={object('containerStyle', styles.container)}
      items={items}
      onChangeSwatch={action('Swatches onChangeSwatch')}
      defaultValue={'blue'}
    />
  ));
