import React from 'react';

import { StyleSheet } from 'react-native';

import { action } from '@storybook/addon-actions';
import { boolean, number, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Swatches } from '../src/components/Swatches';

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  label: {
    padding: 0,
  },
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
  { color: 'blue', name: 'blue', value: 'blue3', available: false },
];

storiesOf('Swatches', module).add('basic usage', () => (
  <Swatches
    colorContainerStyle={{
      height: number('swatchSize', swatchSize),
      width: number('swatchSize', swatchSize),
    }}
    defaultValue="blue"
    items={items}
    label={boolean('label', true)}
    labelTitleStyle={object('labelStyle', styles.label)}
    maxSwatches={number('maxSwatches', maxSwatches)}
    moreLessStyle={{ display: boolean('showMoreLess', false) ? 'flex' : 'none' }}
    onChangeSwatch={action('Swatches onChangeSwatch')}
    style={object('containerStyle', styles.container)}
    title={text('title', title)}
  />
));
