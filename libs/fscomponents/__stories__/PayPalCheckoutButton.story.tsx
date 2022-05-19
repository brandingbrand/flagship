import React from 'react';

import { StyleSheet, View } from 'react-native';

import { action } from '@storybook/addon-actions';
import { object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import type { ButtonShape, ButtonTheme } from '../src/components/PayPalCheckoutButton';
import { PayPalCheckoutButton } from '../src/components/PayPalCheckoutButton';

const defaultStyle = {
  width: 250,
  margin: 5,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

const shapeOptions = ['pill', 'rect'];
const themeOptions = ['gold', 'blue', 'silver', 'black'];

storiesOf('PayPalCheckoutButton', module).add('basic usage', () => (
  <View style={styles.container}>
    <PayPalCheckoutButton
      onPress={action('onPress')}
      shape={select('Shape', shapeOptions, 'rect') as ButtonShape}
      style={object('Style', defaultStyle)}
      tagLine={text('TagLine', 'Tag Line Text')}
      theme={select('Theme', themeOptions, 'blue') as ButtonTheme}
      title={text('Title', 'Checkout')}
    />
  </View>
));
