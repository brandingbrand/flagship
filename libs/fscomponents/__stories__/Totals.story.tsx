// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import type { TotalProps } from '../src/components/Total';
import { Totals } from '../src/components/Totals';

const styles = StyleSheet.create({
  style: {
    padding: 20,
  },
  zipCode: {
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
});

const valueContent = (
  <TouchableOpacity onPress={action('Totals Shipping onPress')}>
    <Text style={styles.zipCode}>Enter Zip Code</Text>
  </TouchableOpacity>
);

const totals: TotalProps[] = [
  {
    keyName: 'Subtotal',
    value: '$19.05',
  },
  {
    keyName: 'Tax (7%)',
    value: '$1.33',
  },
  {
    keyName: 'Shipping',
    value: valueContent,
  },
  {
    keyName: 'Total',
    keyStyle: {
      fontWeight: 'bold',
    },
    value: '$20.38',
    valueStyle: {
      fontWeight: 'bold',
    },
    style: {
      borderTopWidth: StyleSheet.hairlineWidth,
    },
  },
];

const style = {
  padding: 20,
  borderWidth: 1,
};

storiesOf('Totals', module).add('basic usage', () => (
  <Totals style={object('containerStyle', style)} totals={totals} />
));
