/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { TotalProps } from '../Total';
import { Totals } from '../Totals';

const styles = StyleSheet.create({
  style: {
    padding: 20
  },
  zipCode: {
    textDecorationLine: 'underline',
    textAlign: 'right'
  }
});

const totals: TotalProps[] = [
  {
    keyName: 'Subtotal',
    value: '$19.05'
  },
  {
    keyName: 'Tax (7%)',
    value: '$1.33'
  },
  {
    keyName: 'Shipping',
    value: (
      <TouchableOpacity onPress={action('Totals Shipping onPress')}>
        <Text style={styles.zipCode}>
          Enter Zip Code
        </Text>
      </TouchableOpacity>
    )
  },
  {
    keyName: 'Total',
    keyStyle: {
      fontWeight: 'bold'
    },
    value: '$20.38',
    valueStyle: {
      fontWeight: 'bold'
    },
    style: {
      borderTopWidth: StyleSheet.hairlineWidth
    }
  }
];

storiesOf('Totals', module)
  .add('basic usage', () => (
    <Totals
      totals={totals}
      style={styles.style}
    />
  ));
