import React from 'react';
import { StyleSheet, View } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  select,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { ButtonShape, ButtonTheme, PayPalCheckoutButton } from '../src/components/PayPalCheckoutButton';

const defaultStyle = {
  width: 250,
  margin: 5
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});

const shapeOptions = ['pill', 'rect'];
const themeOptions = ['gold', 'blue', 'silver', 'black'];

storiesOf('PayPalCheckoutButton', module)
  .add('basic usage', () => {
    return (
      <View style={styles.container}>
        <PayPalCheckoutButton
          onPress={action('onPress')}
          title={text('Title', 'Checkout')}
          shape={select('Shape', shapeOptions, 'rect') as ButtonShape}
          theme={select('Theme', themeOptions, 'blue') as ButtonTheme}
          tagLine={text('TagLine', 'Tag Line Text')}
          style={object('Style', defaultStyle)}
        />
      </View>
    );
  });
